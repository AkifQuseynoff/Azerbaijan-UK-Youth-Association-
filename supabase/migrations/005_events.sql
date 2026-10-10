-- Events, podcast recordings and registrations.
-- Clients never write registrations directly: every change goes through the
-- security-definer functions below, which lock the event row so capacity and
-- the waitlist cannot be oversold by concurrent requests.

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  title text not null check (char_length(title) between 1 and 200),
  description text not null default '' check (char_length(description) <= 5000),
  kind text not null default 'event' check (kind in ('event', 'podcast_live')),
  category text not null check (category in ('Culture', 'Education', 'Networking', 'Leadership', 'Community', 'Podcast')),
  starts_at timestamptz not null,
  ends_at timestamptz,
  venue text not null default '' check (char_length(venue) <= 200),
  -- null capacity means unlimited places
  capacity integer check (capacity is null or capacity > 0),
  waitlist_enabled boolean not null default true,
  registration_opens_at timestamptz,
  registration_closes_at timestamptz,
  status text not null default 'draft' check (status in ('draft', 'published', 'cancelled')),
  cover_path text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_end_after_start check (ends_at is null or ends_at > starts_at),
  constraint events_window_order check (
    registration_opens_at is null
    or registration_closes_at is null
    or registration_closes_at > registration_opens_at
  )
);

create index if not exists events_starts_at_idx on public.events (starts_at);
create index if not exists events_status_idx on public.events (status);

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
before update on public.events
for each row execute function public.set_updated_at();

-- Online joining details live apart from the public event row so they are only
-- visible to staff and to people holding a confirmed place.
create table if not exists public.event_links (
  event_id uuid primary key references public.events (id) on delete cascade,
  online_url text check (online_url is null or online_url ~ '^https://' and char_length(online_url) <= 500),
  notes text check (notes is null or char_length(notes) <= 1000)
);

create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  status text not null check (status in ('confirmed', 'waitlisted', 'cancelled', 'attended')),
  answers jsonb not null default '{}'::jsonb check (pg_column_size(answers) <= 4000),
  ticket_code text not null unique
    default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10)),
  created_at timestamptz not null default now(),
  cancelled_at timestamptz,
  checked_in_at timestamptz,
  unique (event_id, user_id)
);

create index if not exists event_registrations_event_status_idx
  on public.event_registrations (event_id, status, created_at);
create index if not exists event_registrations_user_idx
  on public.event_registrations (user_id);

-- ---------------------------------------------------------------------------
-- Waitlist promotion (internal; callers must already hold the event row lock)
-- ---------------------------------------------------------------------------
create or replace function public.promote_waitlist(p_event_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  ev public.events%rowtype;
  taken integer;
  next_id uuid;
begin
  select * into ev from public.events where id = p_event_id;
  if not found or ev.status <> 'published' then
    return;
  end if;

  loop
    select count(*) into taken
      from public.event_registrations
      where event_id = p_event_id and status in ('confirmed', 'attended');

    exit when ev.capacity is not null and taken >= ev.capacity;

    select id into next_id
      from public.event_registrations
      where event_id = p_event_id and status = 'waitlisted'
      order by created_at
      limit 1
      for update skip locked;

    exit when next_id is null;

    update public.event_registrations set status = 'confirmed' where id = next_id;
  end loop;
end;
$$;

revoke all on function public.promote_waitlist(uuid) from public, anon, authenticated;

-- Raising capacity (or turning the waitlist on) fills places from the waitlist.
create or replace function public.events_after_capacity_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.promote_waitlist(new.id);
  return null;
end;
$$;

drop trigger if exists events_promote_on_change on public.events;
create trigger events_promote_on_change
after update of capacity, status on public.events
for each row
when (old.capacity is distinct from new.capacity or old.status is distinct from new.status)
execute function public.events_after_capacity_change();

-- ---------------------------------------------------------------------------
-- Member-facing functions
-- ---------------------------------------------------------------------------
create or replace function public.register_for_event(p_event_id uuid, p_answers jsonb default '{}'::jsonb)
returns public.event_registrations
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  ev public.events%rowtype;
  existing public.event_registrations%rowtype;
  result public.event_registrations%rowtype;
  taken integer;
  new_status text;
begin
  if uid is null then
    raise exception 'Please log in to register.' using errcode = '28000';
  end if;
  if not public.is_active_member() then
    raise exception 'Your membership is not active.' using errcode = '42501';
  end if;

  -- Serialise all registrations for this event.
  select * into ev from public.events where id = p_event_id for update;
  if not found or ev.status <> 'published' then
    raise exception 'This event is not open for registration.' using errcode = 'P0002';
  end if;
  if coalesce(ev.ends_at, ev.starts_at) <= now() then
    raise exception 'This event has already taken place.' using errcode = 'P0001';
  end if;
  if ev.registration_opens_at is not null and now() < ev.registration_opens_at then
    raise exception 'Registration has not opened yet.' using errcode = 'P0001';
  end if;
  if ev.registration_closes_at is not null and now() > ev.registration_closes_at then
    raise exception 'Registration for this event has closed.' using errcode = 'P0001';
  end if;

  select * into existing from public.event_registrations
    where event_id = p_event_id and user_id = uid;
  if found and existing.status in ('confirmed', 'waitlisted', 'attended') then
    return existing; -- idempotent: a double click changes nothing
  end if;

  select count(*) into taken from public.event_registrations
    where event_id = p_event_id and status in ('confirmed', 'attended');

  if ev.capacity is null or taken < ev.capacity then
    new_status := 'confirmed';
  elsif ev.waitlist_enabled then
    new_status := 'waitlisted';
  else
    raise exception 'This event is full.' using errcode = 'P0001';
  end if;

  insert into public.event_registrations (event_id, user_id, status, answers)
  values (p_event_id, uid, new_status, coalesce(p_answers, '{}'::jsonb))
  on conflict (event_id, user_id) do update
    set status = excluded.status,
        answers = excluded.answers,
        created_at = now(), -- rejoin the back of the queue
        cancelled_at = null
  returning * into result;

  return result;
end;
$$;

create or replace function public.cancel_registration(p_event_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Please log in.' using errcode = '28000';
  end if;

  perform 1 from public.events where id = p_event_id for update;

  update public.event_registrations
    set status = 'cancelled', cancelled_at = now()
    where event_id = p_event_id and user_id = uid and status in ('confirmed', 'waitlisted');

  perform public.promote_waitlist(p_event_id);
end;
$$;

-- ---------------------------------------------------------------------------
-- Staff functions
-- ---------------------------------------------------------------------------
create or replace function public.admin_set_registration_status(p_registration_id uuid, p_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  ev_id uuid;
begin
  if not public.is_staff() then
    raise exception 'Staff only.' using errcode = '42501';
  end if;
  if p_status not in ('cancelled', 'attended') then
    raise exception 'Unsupported status.' using errcode = '22023';
  end if;

  select event_id into ev_id from public.event_registrations where id = p_registration_id;
  if ev_id is null then
    raise exception 'Registration not found.' using errcode = 'P0002';
  end if;

  perform 1 from public.events where id = ev_id for update;

  update public.event_registrations
    set status = p_status,
        cancelled_at = case when p_status = 'cancelled' then now() else cancelled_at end,
        checked_in_at = case when p_status = 'attended' then now() else checked_in_at end
    where id = p_registration_id and status in ('confirmed', 'waitlisted', 'attended');

  perform public.promote_waitlist(ev_id);
end;
$$;

create or replace function public.event_attendees(p_event_id uuid)
returns table (
  registration_id uuid,
  user_id uuid,
  status text,
  first_name text,
  last_name text,
  email text,
  phone text,
  ticket_code text,
  registered_at timestamptz,
  checked_in_at timestamptz
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'Staff only.' using errcode = '42501';
  end if;
  return query
    select r.id, r.user_id, r.status, p.first_name, p.last_name, u.email::text, p.phone,
           r.ticket_code, r.created_at, r.checked_in_at
    from public.event_registrations r
    join public.profiles p on p.id = r.user_id
    join auth.users u on u.id = r.user_id
    where r.event_id = p_event_id
    order by r.status, r.created_at;
end;
$$;

revoke all on function public.register_for_event(uuid, jsonb) from public, anon;
revoke all on function public.cancel_registration(uuid) from public, anon;
revoke all on function public.admin_set_registration_status(uuid, text) from public, anon;
revoke all on function public.event_attendees(uuid) from public, anon;
grant execute on function public.register_for_event(uuid, jsonb) to authenticated;
grant execute on function public.cancel_registration(uuid) to authenticated;
grant execute on function public.admin_set_registration_status(uuid, text) to authenticated;
grant execute on function public.event_attendees(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Public availability (counts only, never who registered).
-- The view deliberately runs with its owner's rights so anonymous visitors can
-- see places left without any access to event_registrations.
-- ---------------------------------------------------------------------------
create or replace view public.event_availability as
select
  e.id as event_id,
  e.capacity,
  count(r.id) filter (where r.status in ('confirmed', 'attended'))::integer as taken,
  case
    when e.capacity is null then null
    else greatest(e.capacity - count(r.id) filter (where r.status in ('confirmed', 'attended')), 0)::integer
  end as spots_left,
  count(r.id) filter (where r.status = 'waitlisted')::integer as waitlisted
from public.events e
left join public.event_registrations r on r.event_id = e.id
where e.status in ('published', 'cancelled')
group by e.id;

grant select on public.event_availability to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table public.events enable row level security;
alter table public.event_links enable row level security;
alter table public.event_registrations enable row level security;

drop policy if exists "events_public_read" on public.events;
create policy "events_public_read" on public.events
for select to anon, authenticated
using (status in ('published', 'cancelled'));

drop policy if exists "events_staff_select_all" on public.events;
create policy "events_staff_select_all" on public.events
for select to authenticated
using (public.is_staff());

drop policy if exists "events_staff_insert" on public.events;
create policy "events_staff_insert" on public.events
for insert to authenticated
with check (public.is_staff());

drop policy if exists "events_staff_update" on public.events;
create policy "events_staff_update" on public.events
for update to authenticated
using (public.is_staff())
with check (public.is_staff());

-- Only drafts can be deleted; anything people registered for is cancelled instead.
drop policy if exists "events_staff_delete" on public.events;
create policy "events_staff_delete" on public.events
for delete to authenticated
using (public.is_staff() and status = 'draft');

drop policy if exists "event_links_select" on public.event_links;
create policy "event_links_select" on public.event_links
for select to authenticated
using (
  public.is_staff()
  or exists (
    select 1 from public.event_registrations r
    where r.event_id = event_links.event_id
      and r.user_id = auth.uid()
      and r.status in ('confirmed', 'attended')
  )
);

drop policy if exists "event_links_staff_write" on public.event_links;
create policy "event_links_staff_write" on public.event_links
for all to authenticated
using (public.is_staff())
with check (public.is_staff());

-- Members see only their own registrations; staff see all. There are no
-- insert/update/delete policies on purpose: writes go through the functions above.
drop policy if exists "event_registrations_select" on public.event_registrations;
create policy "event_registrations_select" on public.event_registrations
for select to authenticated
using (user_id = auth.uid() or public.is_staff());

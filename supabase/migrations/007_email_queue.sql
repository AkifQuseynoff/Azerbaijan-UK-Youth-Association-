-- Transactional emails for event registrations.
-- Database triggers only *queue* messages; the process-emails Edge Function sends
-- them. A failed send is retried and can never block or roll back a booking.

alter table public.event_registrations
  add column if not exists reminder_sent_at timestamptz;

create table if not exists public.email_outbox (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in (
    'registration_confirmed', 'waitlisted', 'waitlist_promoted',
    'registration_cancelled', 'event_cancelled', 'event_reminder'
  )),
  user_id uuid not null references public.profiles (id) on delete cascade,
  event_id uuid not null references public.events (id) on delete cascade,
  registration_id uuid references public.event_registrations (id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'sending', 'sent', 'failed')),
  attempts integer not null default 0,
  last_error text,
  send_after timestamptz not null default now(),
  claimed_at timestamptz,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

create index if not exists email_outbox_due_idx on public.email_outbox (status, send_after);

alter table public.email_outbox enable row level security;
revoke all on public.email_outbox from anon, authenticated;

-- Staff can see delivery problems from the dashboard; nobody can write.
drop policy if exists "email_outbox_staff_select" on public.email_outbox;
create policy "email_outbox_staff_select" on public.email_outbox
for select to authenticated
using (public.is_staff());
grant select on public.email_outbox to authenticated;

-- ---------------------------------------------------------------------------
-- Queue an email whenever a registration changes in a way members care about
-- ---------------------------------------------------------------------------
create or replace function public.enqueue_registration_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  old_status text := case when tg_op = 'UPDATE' then old.status end;
  k text;
begin
  if tg_op = 'UPDATE' and old.status = new.status then
    return null;
  end if;

  k := case
    when new.status = 'confirmed' and old_status = 'waitlisted' then 'waitlist_promoted'
    when new.status = 'confirmed' then 'registration_confirmed'
    when new.status = 'waitlisted' then 'waitlisted'
    when new.status = 'cancelled' and old_status in ('confirmed', 'waitlisted') then 'registration_cancelled'
    else null
  end;

  if k is not null then
    insert into public.email_outbox (kind, user_id, event_id, registration_id)
    values (k, new.user_id, new.event_id, new.id);
  end if;
  return null;
end;
$$;

drop trigger if exists event_registrations_enqueue_email on public.event_registrations;
create trigger event_registrations_enqueue_email
after insert or update of status on public.event_registrations
for each row execute function public.enqueue_registration_email();

-- Everyone holding a place (or a waitlist spot) hears about a cancelled event.
create or replace function public.enqueue_event_cancelled_emails()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.email_outbox (kind, user_id, event_id, registration_id)
  select 'event_cancelled', r.user_id, r.event_id, r.id
  from public.event_registrations r
  where r.event_id = new.id and r.status in ('confirmed', 'waitlisted');
  return null;
end;
$$;

drop trigger if exists events_enqueue_cancelled_emails on public.events;
create trigger events_enqueue_cancelled_emails
after update of status on public.events
for each row
when (new.status = 'cancelled' and old.status is distinct from 'cancelled')
execute function public.enqueue_event_cancelled_emails();

-- ---------------------------------------------------------------------------
-- Reminders: confirmed attendees get one email within 24 hours of the start.
-- Only people who registered more than 24 hours ahead qualify, so nobody gets a
-- reminder moments after their confirmation.
-- ---------------------------------------------------------------------------
create or replace function public.enqueue_event_reminders()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  queued integer;
begin
  with due as (
    select r.id
    from public.event_registrations r
    join public.events e on e.id = r.event_id
    where r.status = 'confirmed'
      and r.reminder_sent_at is null
      and e.status = 'published'
      and e.starts_at > now()
      and e.starts_at <= now() + interval '24 hours'
      and r.created_at <= e.starts_at - interval '24 hours'
  ), marked as (
    update public.event_registrations r
    set reminder_sent_at = now()
    from due
    where r.id = due.id
    returning r.id, r.user_id, r.event_id
  ), ins as (
    insert into public.email_outbox (kind, user_id, event_id, registration_id)
    select 'event_reminder', user_id, event_id, id from marked
    returning 1
  )
  select count(*) into queued from ins;
  return queued;
end;
$$;

-- ---------------------------------------------------------------------------
-- Used by the Edge Function (service role only)
-- ---------------------------------------------------------------------------
create or replace function public.claim_emails(p_limit integer default 20)
returns table (
  id uuid,
  kind text,
  attempts integer,
  to_email text,
  first_name text,
  event_title text,
  event_slug text,
  starts_at timestamptz,
  ends_at timestamptz,
  venue text,
  online_url text,
  ticket_code text
)
language plpgsql
security definer
set search_path = public
as $$
#variable_conflict use_column
begin
  return query
  with picked as (
    select o.id
    from public.email_outbox o
    where o.attempts < 5
      and o.send_after <= now()
      and (
        o.status = 'pending'
        or (o.status = 'sending' and o.claimed_at < now() - interval '10 minutes')
      )
    order by o.created_at
    limit greatest(p_limit, 1)
    for update skip locked
  ), claimed as (
    update public.email_outbox o
    set status = 'sending', attempts = o.attempts + 1, claimed_at = now()
    from picked
    where o.id = picked.id
    returning o.*
  )
  select c.id, c.kind, c.attempts, u.email::text, p.first_name, e.title, e.slug,
         e.starts_at, e.ends_at, e.venue,
         case when c.kind in ('registration_confirmed', 'waitlist_promoted', 'event_reminder')
              then l.online_url end,
         r.ticket_code
  from claimed c
  join public.profiles p on p.id = c.user_id
  join auth.users u on u.id = c.user_id
  join public.events e on e.id = c.event_id
  left join public.event_links l on l.event_id = e.id
  left join public.event_registrations r on r.id = c.registration_id;
end;
$$;

create or replace function public.mark_email(p_id uuid, p_ok boolean, p_error text default null)
returns void
language sql
security definer
set search_path = public
as $$
  update public.email_outbox
  set status = case when p_ok then 'sent' when attempts >= 5 then 'failed' else 'pending' end,
      sent_at = case when p_ok then now() end,
      last_error = left(p_error, 500),
      send_after = now() + (attempts * interval '5 minutes')
  where id = p_id;
$$;

revoke all on function public.enqueue_event_reminders() from public, anon, authenticated;
revoke all on function public.claim_emails(integer) from public, anon, authenticated;
revoke all on function public.mark_email(uuid, boolean, text) from public, anon, authenticated;
grant execute on function public.enqueue_event_reminders() to service_role;
grant execute on function public.claim_emails(integer) to service_role;
grant execute on function public.mark_email(uuid, boolean, text) to service_role;

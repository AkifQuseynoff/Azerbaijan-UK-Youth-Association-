-- Hardening: server-side validation, consent records, scheduling, storage limits.

-- ---------------------------------------------------------------------------
-- Profiles: consent records, length limits, safer defaults
-- ---------------------------------------------------------------------------
alter table public.profiles
  add column if not exists terms_accepted_at timestamptz,
  add column if not exists newsletter_consented_at timestamptz;

-- Marketing email needs an explicit opt-in (UK GDPR / PECR): default to off.
alter table public.profiles alter column newsletter set default false;

alter table public.profiles drop constraint if exists profiles_field_lengths;
alter table public.profiles add constraint profiles_field_lengths check (
  char_length(first_name) <= 80
  and char_length(last_name) <= 80
  and char_length(coalesce(phone, '')) <= 30
  and char_length(coalesce(city, '')) <= 80
  and char_length(coalesce(occupation, '')) <= 120
  and char_length(coalesce(university, '')) <= 160
  and char_length(coalesce(heard_from, '')) <= 80
  and coalesce(array_length(interests, 1), 0) <= 20
);

alter table public.profiles drop constraint if exists profiles_member_type_check;
alter table public.profiles add constraint profiles_member_type_check
  check (member_type in ('standard'));

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Parse a date without ever raising: bad input becomes null.
create or replace function public.safe_date(value text)
returns date
language plpgsql
immutable
as $$
begin
  return nullif(btrim(value), '')::date;
exception when others then
  return null;
end;
$$;

create or replace function public.is_old_enough(dob date, min_age int default 16)
returns boolean
language sql
stable
as $$
  select dob is not null and dob <= (current_date - make_interval(years => min_age))::date;
$$;

-- New-user trigger: tolerant of bad metadata, enforces the 16+ rule and
-- records consent timestamps. Raises a readable error instead of a cast failure.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  dob date := public.safe_date(meta->>'date_of_birth');
  wants_newsletter boolean := coalesce(meta->>'newsletter', 'false') = 'true';
  interest_list text[];
begin
  if not public.is_old_enough(dob, 16) then
    raise exception 'Membership is open to people aged 16 and over.'
      using errcode = 'check_violation';
  end if;

  if jsonb_typeof(meta->'interests') = 'array' then
    select coalesce(array_agg(left(i, 60)), '{}')
      into interest_list
      from (select jsonb_array_elements_text(meta->'interests') as i limit 20) s;
  else
    interest_list := '{}';
  end if;

  insert into public.profiles (
    id, first_name, last_name, phone, date_of_birth, city, occupation,
    university, heard_from, newsletter, interests,
    terms_accepted_at, newsletter_consented_at
  )
  values (
    new.id,
    left(coalesce(meta->>'first_name', ''), 80),
    left(coalesce(meta->>'last_name', ''), 80),
    left(nullif(meta->>'phone', ''), 30),
    dob,
    left(nullif(meta->>'city', ''), 80),
    left(nullif(meta->>'occupation', ''), 120),
    left(nullif(meta->>'university', ''), 160),
    left(nullif(meta->>'heard_from', ''), 80),
    wants_newsletter,
    interest_list,
    case when coalesce(meta->>'terms_accepted', 'false') = 'true' then now() end,
    case when wants_newsletter then now() end
  );
  return new;
end;
$$;

-- Members may edit their own profile, but never role, status, member type,
-- date of birth or consent history. Admins may change anything.
create or replace function public.protect_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    new.role := old.role;
    new.status := old.status;
    new.member_type := old.member_type;
    new.date_of_birth := old.date_of_birth;
    new.terms_accepted_at := old.terms_accepted_at;
    new.created_at := old.created_at;
    if new.newsletter is distinct from old.newsletter then
      new.newsletter_consented_at := case when new.newsletter then now() end;
    else
      new.newsletter_consented_at := old.newsletter_consented_at;
    end if;
  end if;
  return new;
end;
$$;

-- Any signed-in member whose account is active. Use this in RLS for member features
-- (e.g. event registration) so deactivated accounts lose access immediately.
create or replace function public.is_active_member()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and status = 'active'
  );
$$;

-- Deactivated members can still read their own row (so the app can explain why
-- they are locked out) but can no longer edit it.
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using ((id = auth.uid() and status = 'active') or public.is_admin())
with check ((id = auth.uid()) or public.is_admin());

-- Profiles are created by the signup trigger only; clients must not insert.
drop policy if exists "profiles_insert_own" on public.profiles;

-- ---------------------------------------------------------------------------
-- Articles: scheduled publishing, integrity checks
-- ---------------------------------------------------------------------------
-- A scheduled article becomes visible automatically once published_at passes.
drop policy if exists "articles_public_read_published" on public.articles;
create policy "articles_public_read_published"
on public.articles
for select
to anon, authenticated
using (
  status in ('published', 'scheduled')
  and published_at is not null
  and published_at <= now()
);

alter table public.articles drop constraint if exists articles_publish_needs_date;
alter table public.articles add constraint articles_publish_needs_date
  check (status = 'draft' or published_at is not null);

alter table public.articles drop constraint if exists articles_slug_format;
alter table public.articles add constraint articles_slug_format
  check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80);

alter table public.articles drop constraint if exists articles_field_lengths;
alter table public.articles add constraint articles_field_lengths check (
  char_length(title) between 1 and 200
  and char_length(excerpt) <= 600
  and char_length(body) <= 50000
  and char_length(author_name) <= 120
);

-- ---------------------------------------------------------------------------
-- Storage: cap size and restrict types for cover images
-- ---------------------------------------------------------------------------
update storage.buckets
set file_size_limit = 5242880, -- 5 MiB
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
where id = 'news-covers';

-- Covers get a fresh random path on every upload, so overwriting is never needed.
drop policy if exists "news_covers_staff_update" on storage.objects;

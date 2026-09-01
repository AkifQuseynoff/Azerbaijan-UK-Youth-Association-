-- Profiles, membership data, and role helpers
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null default '',
  last_name text not null default '',
  phone text,
  date_of_birth date,
  city text,
  occupation text,
  university text,
  member_type text not null default 'standard',
  heard_from text,
  newsletter boolean not null default true,
  interests text[] not null default '{}',
  role text not null default 'member' check (role in ('member', 'editor', 'admin')),
  status text not null default 'active' check (status in ('active', 'deactivated')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    first_name,
    last_name,
    phone,
    date_of_birth,
    city,
    occupation,
    university,
    heard_from,
    newsletter,
    interests
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', ''),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    new.raw_user_meta_data->>'phone',
    nullif(new.raw_user_meta_data->>'date_of_birth', '')::date,
    new.raw_user_meta_data->>'city',
    new.raw_user_meta_data->>'occupation',
    new.raw_user_meta_data->>'university',
    new.raw_user_meta_data->>'heard_from',
    coalesce((new.raw_user_meta_data->>'newsletter')::boolean, true),
    coalesce(
      array(select jsonb_array_elements_text(new.raw_user_meta_data->'interests')),
      '{}'
    )
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('editor', 'admin')
      and status = 'active'
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and status = 'active'
  );
$$;

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
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_privileges on public.profiles;
create trigger protect_profile_privileges
before update on public.profiles
for each row execute function public.protect_profile_privileges();

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own_or_staff" on public.profiles;
create policy "profiles_select_own_or_staff"
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.is_staff());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

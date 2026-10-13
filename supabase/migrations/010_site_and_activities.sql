-- Two things the association manages itself:
--  * activities: "what we have been doing" entries shown on the home page and the About page
--  * site_settings: the About text, charity number, contact details and social links (one row, admins edit it)

-- ---------------------------------------------------------------------------
-- Activities
-- ---------------------------------------------------------------------------
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  summary text not null default '' check (char_length(summary) <= 600),
  happened_on date,
  link_url text check (link_url is null or (link_url ~ '^https://' and char_length(link_url) <= 500)),
  cover_path text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists activities_listing_idx on public.activities (status, happened_on desc nulls last, created_at desc);

drop trigger if exists activities_set_updated_at on public.activities;
create trigger activities_set_updated_at
before update on public.activities
for each row execute function public.set_updated_at();

alter table public.activities enable row level security;

drop policy if exists "activities_public_read" on public.activities;
create policy "activities_public_read" on public.activities
for select to anon, authenticated using (status = 'published');

drop policy if exists "activities_staff_select_all" on public.activities;
create policy "activities_staff_select_all" on public.activities
for select to authenticated using (public.is_staff());

drop policy if exists "activities_staff_insert" on public.activities;
create policy "activities_staff_insert" on public.activities
for insert to authenticated with check (public.is_staff());

drop policy if exists "activities_staff_update" on public.activities;
create policy "activities_staff_update" on public.activities
for update to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "activities_staff_delete" on public.activities;
create policy "activities_staff_delete" on public.activities
for delete to authenticated using (public.is_staff());

-- ---------------------------------------------------------------------------
-- Site settings (a single row, id = 1). Everything here is public information.
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  id integer primary key check (id = 1),
  about text not null default '' check (char_length(about) <= 3000),
  charity_number text not null default '' check (char_length(charity_number) <= 40),
  contact_email text not null default '' check (char_length(contact_email) <= 200),
  contact_phone text not null default '' check (char_length(contact_phone) <= 60),
  contact_address text not null default '' check (char_length(contact_address) <= 300),
  contact_hours text not null default '' check (char_length(contact_hours) <= 200),
  instagram_url text not null default '' check (instagram_url = '' or (instagram_url ~ '^https://' and char_length(instagram_url) <= 300)),
  facebook_url text not null default '' check (facebook_url = '' or (facebook_url ~ '^https://' and char_length(facebook_url) <= 300)),
  linkedin_url text not null default '' check (linkedin_url = '' or (linkedin_url ~ '^https://' and char_length(linkedin_url) <= 300)),
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;

drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read" on public.site_settings
for select to anon, authenticated using (true);

-- Only admins change it, and the row can only be edited, never added or removed.
drop policy if exists "site_settings_admin_update" on public.site_settings;
create policy "site_settings_admin_update" on public.site_settings
for update to authenticated using (public.is_admin()) with check (public.is_admin());

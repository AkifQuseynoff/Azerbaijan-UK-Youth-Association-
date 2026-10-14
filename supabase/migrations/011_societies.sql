-- Azerbaijan Societies of Universities: a directory the team keeps up to date.
-- Visitors see published entries; staff (editors and admins) add, edit and delete them.

create table if not exists public.societies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  name text not null check (char_length(name) between 1 and 120),
  university text not null check (char_length(university) between 1 and 160),
  city text not null default '' check (char_length(city) <= 80),
  description text not null default '' check (char_length(description) <= 2000),
  logo_path text,
  website_url text not null default '' check (website_url = '' or (website_url ~ '^https://' and char_length(website_url) <= 300)),
  instagram_url text not null default '' check (instagram_url = '' or (instagram_url ~ '^https://' and char_length(instagram_url) <= 300)),
  facebook_url text not null default '' check (facebook_url = '' or (facebook_url ~ '^https://' and char_length(facebook_url) <= 300)),
  contact_email text not null default '' check (char_length(contact_email) <= 200),
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists societies_listing_idx on public.societies (status, name);

drop trigger if exists societies_set_updated_at on public.societies;
create trigger societies_set_updated_at
before update on public.societies
for each row execute function public.set_updated_at();

alter table public.societies enable row level security;

drop policy if exists "societies_public_read" on public.societies;
create policy "societies_public_read" on public.societies
for select to anon, authenticated using (status = 'published');

drop policy if exists "societies_staff_select_all" on public.societies;
create policy "societies_staff_select_all" on public.societies
for select to authenticated using (public.is_staff());

drop policy if exists "societies_staff_insert" on public.societies;
create policy "societies_staff_insert" on public.societies
for insert to authenticated with check (public.is_staff());

drop policy if exists "societies_staff_update" on public.societies;
create policy "societies_staff_update" on public.societies
for update to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "societies_staff_delete" on public.societies;
create policy "societies_staff_delete" on public.societies
for delete to authenticated using (public.is_staff());

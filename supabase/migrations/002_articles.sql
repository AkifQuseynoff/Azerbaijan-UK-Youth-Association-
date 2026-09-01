-- Staff-run news magazine
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  body text not null default '',
  category text not null check (category in ('Culture', 'Events', 'Community', 'Announcements')),
  cover_path text,
  author_name text not null default 'Association Communications',
  author_id uuid references public.profiles (id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published')),
  featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_published_at_idx on public.articles (published_at desc);
create index if not exists articles_status_idx on public.articles (status);
create index if not exists articles_search_idx on public.articles using gin (
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(body, ''))
);

drop trigger if exists articles_set_updated_at on public.articles;
create trigger articles_set_updated_at
before update on public.articles
for each row execute function public.set_updated_at();

alter table public.articles enable row level security;

drop policy if exists "articles_public_read_published" on public.articles;
create policy "articles_public_read_published"
on public.articles
for select
to anon, authenticated
using (
  status = 'published'
  and published_at is not null
  and published_at <= now()
);

drop policy if exists "articles_staff_select_all" on public.articles;
create policy "articles_staff_select_all"
on public.articles
for select
to authenticated
using (public.is_staff());

drop policy if exists "articles_staff_insert" on public.articles;
create policy "articles_staff_insert"
on public.articles
for insert
to authenticated
with check (public.is_staff());

drop policy if exists "articles_staff_update" on public.articles;
create policy "articles_staff_update"
on public.articles
for update
to authenticated
using (public.is_staff())
with check (public.is_staff());

drop policy if exists "articles_staff_delete" on public.articles;
create policy "articles_staff_delete"
on public.articles
for delete
to authenticated
using (public.is_staff());

insert into storage.buckets (id, name, public)
values ('news-covers', 'news-covers', true)
on conflict (id) do nothing;

drop policy if exists "news_covers_public_read" on storage.objects;
create policy "news_covers_public_read"
on storage.objects
for select
to public
using (bucket_id = 'news-covers');

drop policy if exists "news_covers_staff_insert" on storage.objects;
create policy "news_covers_staff_insert"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'news-covers' and public.is_staff());

drop policy if exists "news_covers_staff_update" on storage.objects;
create policy "news_covers_staff_update"
on storage.objects
for update
to authenticated
using (bucket_id = 'news-covers' and public.is_staff())
with check (bucket_id = 'news-covers' and public.is_staff());

drop policy if exists "news_covers_staff_delete" on storage.objects;
create policy "news_covers_staff_delete"
on storage.objects
for delete
to authenticated
using (bucket_id = 'news-covers' and public.is_staff());

-- Podcast episodes. Audio is hosted elsewhere (Spotify, YouTube, Apple Podcasts,
-- SoundCloud or a direct audio file); we store links, show notes and metadata.

create table if not exists public.podcast_episodes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  title text not null check (char_length(title) between 1 and 200),
  description text not null default '' check (char_length(description) <= 2000),
  show_notes text not null default '' check (char_length(show_notes) <= 20000),
  episode_number integer check (episode_number is null or episode_number > 0),
  season integer check (season is null or season > 0),
  guests text not null default '' check (char_length(guests) <= 300),
  audio_url text check (audio_url is null or (audio_url ~ '^https://' and char_length(audio_url) <= 500)),
  -- only embeddable player URLs from known hosts are accepted
  embed_url text check (
    embed_url is null or (
      char_length(embed_url) <= 500
      and embed_url ~ '^https://(open\.spotify\.com/embed/|www\.youtube(-nocookie)?\.com/embed/|embed\.podcasts\.apple\.com/|w\.soundcloud\.com/player/)'
    )
  ),
  duration_minutes integer check (duration_minutes is null or duration_minutes between 1 and 600),
  cover_path text,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'published')),
  published_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint podcast_publish_needs_date check (status = 'draft' or published_at is not null)
);

create unique index if not exists podcast_episode_number_idx
  on public.podcast_episodes (coalesce(season, 1), episode_number)
  where episode_number is not null;
create index if not exists podcast_published_idx on public.podcast_episodes (published_at desc);

drop trigger if exists podcast_episodes_set_updated_at on public.podcast_episodes;
create trigger podcast_episodes_set_updated_at
before update on public.podcast_episodes
for each row execute function public.set_updated_at();

alter table public.podcast_episodes enable row level security;

-- Like articles: scheduled episodes appear by themselves once published_at passes.
drop policy if exists "podcast_public_read" on public.podcast_episodes;
create policy "podcast_public_read" on public.podcast_episodes
for select to anon, authenticated
using (status in ('published', 'scheduled') and published_at is not null and published_at <= now());

drop policy if exists "podcast_staff_select_all" on public.podcast_episodes;
create policy "podcast_staff_select_all" on public.podcast_episodes
for select to authenticated using (public.is_staff());

drop policy if exists "podcast_staff_insert" on public.podcast_episodes;
create policy "podcast_staff_insert" on public.podcast_episodes
for insert to authenticated with check (public.is_staff());

drop policy if exists "podcast_staff_update" on public.podcast_episodes;
create policy "podcast_staff_update" on public.podcast_episodes
for update to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "podcast_staff_delete" on public.podcast_episodes;
create policy "podcast_staff_delete" on public.podcast_episodes
for delete to authenticated using (public.is_staff());

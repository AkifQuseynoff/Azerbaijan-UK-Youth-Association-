insert into public.articles (
  slug, title, excerpt, body, category, cover_path, author_name, status, featured, published_at
)
values
  (
    'annual-cultural-festival-returns-london-october',
    'Azerbaijan UK Youth Association Annual Cultural Festival Returns to London This October',
    'We are proud to announce the return of our Annual Cultural Festival, celebrating the rich heritage of Azerbaijan in the heart of London.',
    E'## A flagship weekend for the diaspora\n\nThe Annual Cultural Festival returns to London this October.',
    'Events',
    'https://images.unsplash.com/photo-1612779361237-966485682855?w=800&h=500&fit=crop&auto=format',
    'Association Communications',
    'published',
    true,
    '2026-08-28T09:00:00Z'
  )
on conflict (slug) do nothing;

-- Sample events, always upcoming relative to when the seed runs (Europe/London times).
insert into public.events (
  slug, title, description, kind, category, starts_at, ends_at, venue, capacity, status
)
values
  (
    'cultural-festival-2026',
    'Cultural Festival 2026',
    'Our flagship annual event celebrating Azerbaijani culture through music, dance, traditional crafts, and authentic cuisine.',
    'event', 'Culture',
    (date_trunc('day', now() at time zone 'Europe/London') + interval '21 days 12 hours') at time zone 'Europe/London',
    (date_trunc('day', now() at time zone 'Europe/London') + interval '21 days 20 hours') at time zone 'Europe/London',
    'Southbank Centre, London', 800, 'published'
  ),
  (
    'azerbaijani-language-classes-autumn',
    'Azerbaijani Language Classes: Autumn Term',
    'Free weekly Azerbaijani language classes for all levels, taught by certified language tutors.',
    'event', 'Education',
    (date_trunc('day', now() at time zone 'Europe/London') + interval '8 days 10 hours') at time zone 'Europe/London',
    (date_trunc('day', now() at time zone 'Europe/London') + interval '8 days 12 hours') at time zone 'Europe/London',
    'Camden Community Centre, London', 30, 'published'
  ),
  (
    'career-networking-night-finance-law',
    'Career Networking Night: Finance & Law',
    'An evening connecting Azerbaijani professionals in the City, with a keynote followed by structured networking.',
    'event', 'Networking',
    (date_trunc('day', now() at time zone 'Europe/London') + interval '14 days 18 hours 30 minutes') at time zone 'Europe/London',
    (date_trunc('day', now() at time zone 'Europe/London') + interval '14 days 21 hours') at time zone 'Europe/London',
    'The Gherkin, 30 St Mary Axe, London', 120, 'published'
  ),
  (
    'youth-leadership-summit-2026',
    'Youth Leadership Summit 2026',
    'A full-day summit for young Azerbaijani leaders aged 18 to 30: panels, workshops on civic engagement and a closing address.',
    'event', 'Leadership',
    (date_trunc('day', now() at time zone 'Europe/London') + interval '28 days 9 hours') at time zone 'Europe/London',
    (date_trunc('day', now() at time zone 'Europe/London') + interval '28 days 17 hours') at time zone 'Europe/London',
    'King''s College London, Strand Campus', 200, 'published'
  ),
  (
    'podcast-live-recording-diaspora-voices',
    'Podcast Live Recording: Diaspora Voices',
    'Join us in the audience for a live recording of our podcast, with time for questions at the end.',
    'podcast_live', 'Podcast',
    (date_trunc('day', now() at time zone 'Europe/London') + interval '18 days 19 hours') at time zone 'Europe/London',
    (date_trunc('day', now() at time zone 'Europe/London') + interval '18 days 21 hours') at time zone 'Europe/London',
    'Studio 3, London', 40, 'published'
  )
on conflict (slug) do nothing;

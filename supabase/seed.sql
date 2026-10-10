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

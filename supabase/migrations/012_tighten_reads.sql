-- Pre-launch hardening: two reads that were wider than anyone needs.

-- 1. Member profiles. Editors could read every member's row (date of birth, phone, city, interests)
--    straight from the API, although no screen of theirs uses it. Editors see attendees only through
--    event_attendees(), and admins list members through admin_list_members(); both run with the
--    owner's rights, so they keep working. Now: you read your own profile, and admins read all.
drop policy if exists "profiles_select_own_or_staff" on public.profiles;
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.is_admin());

-- 2. Pictures bucket. The bucket is public, so every picture still loads from its public address
--    without this policy. The policy only allowed anyone to *list* every file, including pictures
--    for drafts that are not published yet. Staff keep it, because deleting a file needs it.
drop policy if exists "news_covers_public_read" on storage.objects;
drop policy if exists "news_covers_staff_read" on storage.objects;
create policy "news_covers_staff_read"
on storage.objects
for select
to authenticated
using (bucket_id = 'news-covers' and public.is_staff());

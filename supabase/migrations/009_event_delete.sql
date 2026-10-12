-- Staff can delete any event, not only drafts. Registrations and the online link are removed with it
-- (on delete cascade), and so are any queued emails for it. The admin screen asks for confirmation and
-- tells the person how many registrations will go; cancelling stays available for events that people
-- should be told about.
drop policy if exists "events_staff_delete" on public.events;
create policy "events_staff_delete" on public.events
for delete to authenticated
using (public.is_staff());

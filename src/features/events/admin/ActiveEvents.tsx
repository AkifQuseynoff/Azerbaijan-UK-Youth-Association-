import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNow } from "../../../lib/useNow";
import { eventsApi } from "../api";
import { eventEnd, formatEventDate, formatEventTime, isHappeningNow } from "../types";
import type { EventItem } from "../types";

/** Published events that have not finished: what visitors can see on the site right now. */
export const isActive = (event: EventItem, now = Date.now()) => event.status === "published" && eventEnd(event) > now;

/** A short list of the active events, shown while staff add or edit one so they can spot clashes and duplicates. */
export default function ActiveEvents({ excludeId }: { excludeId?: string }) {
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const now = useNow();

  useEffect(() => {
    eventsApi.listAll().then(setEvents).catch(() => setEvents([]));
  }, []);

  const active = (events ?? []).filter((e) => isActive(e, now) && e.id !== excludeId).sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  if (events === null) return null;

  return (
    <details open className="card group p-5 sm:p-6">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
        <span className="font-display text-xl font-medium tracking-tight">Active events ({active.length})</span>
        <span className="text-sm font-semibold text-brand-blue group-open:hidden">Show</span>
        <span className="hidden text-sm font-semibold text-brand-blue group-open:inline">Hide</span>
      </summary>
      {active.length === 0 ? (
        <p className="mt-3 text-sm text-mute">No events are active on the site right now.</p>
      ) : (
        <ul className="mt-3 divide-y divide-line">
          {active.map((e) => (
            <li key={e.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Link to={`/admin/events/${e.id}`} className="font-semibold hover:text-brand-blue">{e.title}</Link>
                <p className="text-xs text-mute">
                  {formatEventDate(e.startsAt)} · {formatEventTime(e.startsAt, e.endsAt)}
                  {e.venue ? ` · ${e.venue}` : ""}
                </p>
              </div>
              <span className="text-xs font-semibold text-mute">
                {isHappeningNow(e, now) && <span className="mr-2 font-bold text-brand-red-dark">Live now</span>}
                {e.taken}
                {e.capacity !== null ? ` / ${e.capacity}` : ""} registered
              </span>
            </li>
          ))}
        </ul>
      )}
    </details>
  );
}

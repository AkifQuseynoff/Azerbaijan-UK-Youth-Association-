import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../../components/ui/PageHeader";
import { categoryColors } from "../../../constants";
import { useAuth } from "../../auth/AuthContext";
import { eventsApi } from "../api";
import RegistrationActions from "../RegistrationActions";
import { formatEventDate, formatEventTime, registrationState } from "../types";
import type { EventItem, EventRegistration } from "../types";

export default function EventsPage() {
  const { profile } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [mine, setMine] = useState<Map<string, EventRegistration>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState("All");

  const userId = profile?.id ?? null;

  const refresh = useCallback(async () => {
    const [list, regs] = await Promise.all([
      eventsApi.listUpcoming(),
      userId ? eventsApi.myRegistrations(userId) : Promise.resolve([]),
    ]);
    setEvents(list);
    setMine(new Map(regs.map((r) => [r.eventId, r])));
  }, [userId]);

  useEffect(() => {
    setLoading(true);
    refresh()
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load events."))
      .finally(() => setLoading(false));
  }, [refresh]);

  const categories = useMemo(() => ["All", ...Array.from(new Set(events.map((e) => e.category)))], [events]);
  const visible = selected === "All" ? events : events.filter((e) => e.category === selected);

  return (
    <div className="page-transition min-h-screen bg-[#F4F6FB]">
      <PageHeader eyebrow="Calendar" title="Upcoming events" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={selected === t}
              onClick={() => setSelected(t)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                selected === t ? "bg-[#00997A] text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {error && (
          <p role="alert" className="mb-6 rounded-xl bg-red-50 text-[#CC2229] text-sm px-4 py-3">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-gray-500">Loading events…</p>
        ) : visible.length === 0 ? (
          <p className="text-gray-500">No upcoming events right now. Check back soon.</p>
        ) : (
          <div className="flex flex-col gap-5">
            {visible.map((event) => (
              <EventRow
                key={event.id}
                event={event}
                mine={mine.get(event.id)}
                onChanged={refresh}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EventRow({
  event,
  mine,
  onChanged,
}: {
  event: EventItem;
  mine: EventRegistration | undefined;
  onChanged: () => Promise<void>;
}) {
  const state = registrationState(event, mine);
  const almostFull = event.spotsLeft !== null && event.spotsLeft > 0 && event.spotsLeft <= 20;
  const pctFull = event.capacity ? Math.round((event.taken / event.capacity) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow border border-gray-100 grid md:grid-cols-[1fr_auto] gap-6 items-start">
      <div>
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[event.category] || "bg-gray-200 text-gray-700"}`}>
            {event.category}
          </span>
          {almostFull && state !== "cancelled-event" && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700">Almost full</span>
          )}
          {state === "cancelled-event" && (
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-700">Cancelled</span>
          )}
        </div>
        <h3 className="text-2xl font-bold text-[#0D1B2A] mb-2 font-display">
          <Link to={`/events/${event.slug}`} className="hover:text-[#003580] transition-colors">{event.title}</Link>
        </h3>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500 mb-4">
          <span>{formatEventDate(event.startsAt)} · {formatEventTime(event.startsAt, event.endsAt)}</span>
          {event.venue && <span>{event.venue}</span>}
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{event.description}</p>
        {event.capacity !== null && (
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-100 rounded-full h-2 max-w-xs" role="img" aria-label={`${pctFull}% of places taken`}>
              <div className="h-2 rounded-full bg-[#003580]" style={{ width: `${pctFull}%` }} />
            </div>
            <span className="text-xs text-gray-400">
              {event.spotsLeft === 0 ? (event.waitlistEnabled ? `Full · ${event.waitlisted} on waitlist` : "Full") : `${event.spotsLeft} spots left`}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-start md:items-end gap-2 min-w-44">
        <RegistrationActions event={event} mine={mine} onChanged={onChanged} />
        <Link to={`/events/${event.slug}`} className="text-xs text-[#003580] underline">Details</Link>
      </div>
    </div>
  );
}

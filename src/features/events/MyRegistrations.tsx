import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { eventsApi } from "./api";
import AddToCalendar from "./AddToCalendar";
import { formatEventDate, formatEventTime } from "./types";
import type { EventItem, EventRegistration } from "./types";

type Entry = { registration: EventRegistration; event: EventItem };

export default function MyRegistrations() {
  const { profile } = useAuth();
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const userId = profile?.id;

  const load = useCallback(async () => {
    if (!userId) return;
    setEntries(await eventsApi.myUpcoming(userId));
  }, [userId]);

  useEffect(() => {
    load().catch((err) => {
      setError(err instanceof Error ? err.message : "Could not load your registrations.");
      setEntries([]);
    });
  }, [load]);

  const cancel = async (eventId: string) => {
    if (!userId) return;
    setBusyId(eventId);
    setError("");
    try {
      await eventsApi.cancel(eventId, userId);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not cancel. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section aria-labelledby="my-registrations" className="card mb-8 p-6 sm:p-8">
      <h2 id="my-registrations" className="display mb-5 text-3xl">Your event registrations</h2>
      {error && <p role="alert" className="text-brand-red text-sm mb-4">{error}</p>}
      {entries === null ? (
        <p className="text-sm text-mute">Loading…</p>
      ) : entries.length === 0 ? (
        <p className="text-sm text-mute">
          You have no upcoming bookings. <Link to="/events" className="font-semibold text-brand-blue underline underline-offset-4">Browse events</Link>
        </p>
      ) : (
        <ul className="divide-y divide-line">
          {entries.map(({ registration, event }) => (
            <li key={registration.id} className="py-4 flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex-1">
                <Link to={`/events/${event.slug}`} className="font-display text-lg font-medium tracking-tight hover:text-brand-blue">{event.title}</Link>
                <p className="mt-1 text-xs text-mute">
                  {formatEventDate(event.startsAt)} · {formatEventTime(event.startsAt, event.endsAt)}
                  {event.venue ? ` · ${event.venue}` : ""}
                </p>
                <p className="text-xs mt-1">
                  {registration.status === "confirmed" ? (
                    <span className="font-semibold text-[#2c6638]">Confirmed · ticket {registration.ticketCode}</span>
                  ) : (
                    <span className="font-semibold text-amber-800">On the waitlist</span>
                  )}
                  {event.status === "cancelled" && <span className="text-brand-red font-semibold"> · Event cancelled</span>}
                </p>
              </div>
              <div className="flex gap-3 text-sm">
                {event.status !== "cancelled" && registration.status === "confirmed" && (
                  <AddToCalendar event={event} ticketCode={registration.ticketCode} align="right" />
                )}
                <button
                  type="button"
                  disabled={busyId === event.id}
                  onClick={() => void cancel(event.id)}
                  className="btn btn-sm bg-white text-brand-red-dark shadow-[inset_0_0_0_1.5px_rgba(194,48,40,0.35)] hover:bg-brand-red/5"
                >
                  {registration.status === "confirmed" ? "Cancel" : "Leave waitlist"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

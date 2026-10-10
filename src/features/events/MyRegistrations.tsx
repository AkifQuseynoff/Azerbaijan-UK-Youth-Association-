import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { eventsApi } from "./api";
import { downloadIcs } from "./ics";
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
    <section aria-labelledby="my-registrations" className="bg-white rounded-2xl p-8 border border-gray-100 mb-8">
      <h2 id="my-registrations" className="text-2xl text-[#0D1B2A] font-display mb-5">Your event registrations</h2>
      {error && <p role="alert" className="text-[#CC2229] text-sm mb-4">{error}</p>}
      {entries === null ? (
        <p className="text-gray-400 text-sm">Loading…</p>
      ) : entries.length === 0 ? (
        <p className="text-gray-500 text-sm">
          You have no upcoming bookings. <Link to="/events" className="text-[#003580] underline">Browse events</Link>
        </p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {entries.map(({ registration, event }) => (
            <li key={registration.id} className="py-4 flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex-1">
                <Link to={`/events/${event.slug}`} className="font-semibold text-[#0D1B2A] hover:text-[#003580]">{event.title}</Link>
                <p className="text-xs text-gray-500 mt-1">
                  {formatEventDate(event.startsAt)} · {formatEventTime(event.startsAt, event.endsAt)}
                  {event.venue ? ` · ${event.venue}` : ""}
                </p>
                <p className="text-xs mt-1">
                  {registration.status === "confirmed" ? (
                    <span className="text-[#00997A] font-semibold">Confirmed · ticket {registration.ticketCode}</span>
                  ) : (
                    <span className="text-amber-700 font-semibold">On the waitlist</span>
                  )}
                  {event.status === "cancelled" && <span className="text-[#CC2229] font-semibold"> · Event cancelled</span>}
                </p>
              </div>
              <div className="flex gap-3 text-sm">
                {event.status !== "cancelled" && registration.status === "confirmed" && (
                  <button type="button" onClick={() => downloadIcs(event, registration.ticketCode)} className="px-3 py-2 rounded-lg border border-gray-300 font-medium">
                    Add to calendar
                  </button>
                )}
                <button
                  type="button"
                  disabled={busyId === event.id}
                  onClick={() => void cancel(event.id)}
                  className="px-3 py-2 rounded-lg text-[#CC2229] border border-red-200 font-medium disabled:opacity-50"
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

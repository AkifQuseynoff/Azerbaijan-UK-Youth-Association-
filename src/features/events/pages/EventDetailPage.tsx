import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../../components/ui/PageHeader";
import { categoryColors } from "../../../constants";
import { useAuth } from "../../auth/AuthContext";
import { eventsApi } from "../api";
import AddToCalendar from "../AddToCalendar";
import RegistrationActions from "../RegistrationActions";
import { formatEventDate, formatEventTime } from "../types";
import type { EventItem, EventRegistration } from "../types";

export default function EventDetailPage() {
  const { slug = "" } = useParams();
  const { profile } = useAuth();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [mine, setMine] = useState<EventRegistration | undefined>();
  const [joinLink, setJoinLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userId = profile?.id ?? null;

  const load = useCallback(async () => {
    const found = await eventsApi.getBySlug(slug);
    setEvent(found);
    if (!found || !userId) {
      setMine(undefined);
      setJoinLink(null);
      return;
    }
    const regs = await eventsApi.myRegistrations(userId);
    const registration = regs.find((r) => r.eventId === found.id);
    setMine(registration);
    const active = registration?.status === "confirmed" || registration?.status === "attended";
    setJoinLink(active ? await eventsApi.getJoinLink(found.id, userId) : null);
  }, [slug, userId]);

  useEffect(() => {
    setLoading(true);
    load()
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load this event."))
      .finally(() => setLoading(false));
  }, [load]);

  useEffect(() => {
    if (event) document.title = `${event.title} · Azerbaijan UK Youth Association`;
  }, [event]);

  if (loading) return <div className="min-h-screen pt-24 text-center text-gray-500">Loading…</div>;

  if (!event) {
    return (
      <div className="page-transition min-h-[60vh] flex items-center justify-center px-6 py-24">
        <div className="text-center max-w-md">
          <h1 className="text-3xl text-[#0D1B2A] font-display mb-3">Event not found</h1>
          <p className="text-gray-600 mb-6">{error || "It may have been removed or is not published yet."}</p>
          <Link to="/events" className="px-6 py-3 bg-[#003580] text-white font-semibold rounded-xl">All events</Link>
        </div>
      </div>
    );
  }

  const active = mine?.status === "confirmed" || mine?.status === "waitlisted";
  const pctFull = event.capacity ? Math.round((event.taken / event.capacity) * 100) : 0;

  return (
    <div className="page-transition min-h-screen bg-[#F4F6FB]">
      <PageHeader eyebrow={event.kind === "podcast_live" ? "Live podcast recording" : "Event"} title={event.title} width="max-w-4xl" />
      <div className="max-w-4xl mx-auto px-6 py-10 grid md:grid-cols-[1fr_280px] gap-8 items-start">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
          <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[event.category] || "bg-gray-200 text-gray-700"}`}>
            {event.category}
          </span>
          {event.status === "cancelled" && (
            <p role="status" className="rounded-xl bg-red-50 text-[#CC2229] text-sm px-4 py-3">This event has been cancelled.</p>
          )}
          <dl className="grid sm:grid-cols-2 gap-5 text-sm">
            <div>
              <dt className="text-gray-400 text-xs uppercase tracking-wider mb-1">When</dt>
              <dd className="text-[#0D1B2A] font-medium">{formatEventDate(event.startsAt)}<br />{formatEventTime(event.startsAt, event.endsAt)} (UK time)</dd>
            </div>
            {event.venue && (
              <div>
                <dt className="text-gray-400 text-xs uppercase tracking-wider mb-1">Where</dt>
                <dd className="text-[#0D1B2A] font-medium">{event.venue}</dd>
              </div>
            )}
          </dl>
          {event.description && <p className="text-gray-700 leading-relaxed whitespace-pre-line">{event.description}</p>}

          {joinLink && (
            <div className="rounded-xl bg-teal-50 border border-teal-100 p-4 text-sm">
              <p className="font-semibold text-[#00997A] mb-1">Joining online</p>
              <a href={joinLink} target="_blank" rel="noopener noreferrer" className="text-[#003580] underline break-all">{joinLink}</a>
            </div>
          )}
        </div>

        <aside className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <RegistrationActions event={event} mine={mine} onChanged={load} align="start" />
          {event.capacity !== null && (
            <div>
              <div className="bg-gray-100 rounded-full h-2" role="img" aria-label={`${pctFull}% of places taken`}>
                <div className="h-2 rounded-full bg-[#003580]" style={{ width: `${pctFull}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {event.spotsLeft === 0 ? (event.waitlistEnabled ? `Full · ${event.waitlisted} on waitlist` : "Full") : `${event.spotsLeft} of ${event.capacity} places left`}
              </p>
            </div>
          )}
          {event.status !== "cancelled" && (
            <AddToCalendar event={event} ticketCode={mine?.status === "confirmed" ? mine.ticketCode : undefined} />
          )}
          {active && <p className="text-xs text-gray-400">You can manage all your bookings under Your membership.</p>}
          <Link to="/events" className="block text-sm text-[#003580] underline">← All events</Link>
        </aside>
      </div>
    </div>
  );
}

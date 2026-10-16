import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../../components/ui/PageHeader";
import { categoryColors } from "../../../constants";
import { useAuth } from "../../auth/AuthContext";
import { eventsApi } from "../api";
import AddToCalendar from "../AddToCalendar";
import RegistrationActions from "../RegistrationActions";
import LiveBadge from "../LiveBadge";
import { formatEventDate, formatEventTime, isHappeningNow } from "../types";
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
    if (event) document.title = `${event.title} · UK-Azerbaijan Youth Association`;
  }, [event]);

  if (loading) return <div className="min-h-[60vh] pt-24 text-center text-mute">Loading…</div>;

  if (!event) {
    return (
      <div className="page-transition min-h-[60vh] flex items-center justify-center px-6 py-24">
        <div className="text-center max-w-md">
          <h1 className="display mb-3 text-4xl">Event not found</h1>
          <p className="mb-6 text-mute">{error || "It may have been removed or is not published yet."}</p>
          <Link to="/events" className="btn btn-blue">All events</Link>
        </div>
      </div>
    );
  }

  const active = mine?.status === "confirmed" || mine?.status === "waitlisted";
  const pctFull = event.capacity ? Math.round((event.taken / event.capacity) * 100) : 0;

  return (
    <div className="page-transition">
      <PageHeader eyebrow={event.kind === "podcast_live" ? "Live podcast recording" : "Event"} title={event.title} width="max-w-4xl" />
      <div className="mx-auto grid max-w-4xl items-start gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1fr_300px]">
        <div className="card space-y-6 p-6 sm:p-8">
          {isHappeningNow(event) && <LiveBadge />}
          <span className={`chip ${categoryColors[event.category] || "bg-mist text-ink"}`}>
            {event.category}
          </span>
          {event.status === "cancelled" && (
            <p role="status" className="rounded-2xl bg-brand-red/10 px-4 py-3 text-sm text-brand-red-dark">This event has been cancelled.</p>
          )}
          <dl className="grid sm:grid-cols-2 gap-5 text-sm">
            <div>
              <dt className="eyebrow !text-mute mb-1">When</dt>
              <dd className="font-semibold text-ink">{formatEventDate(event.startsAt)}<br />{formatEventTime(event.startsAt, event.endsAt)} (UK time)</dd>
            </div>
            {event.venue && (
              <div>
                <dt className="eyebrow !text-mute mb-1">Where</dt>
                <dd className="font-semibold text-ink">{event.venue}</dd>
              </div>
            )}
          </dl>
          {event.description && <p className="whitespace-pre-line leading-relaxed text-mute">{event.description}</p>}

          {joinLink && (
            <div className="rounded-2xl bg-brand-green/10 p-4 text-sm ring-1 ring-brand-green/20">
              <p className="mb-1 font-semibold text-[#2c6638]">Joining online</p>
              <a href={joinLink} target="_blank" rel="noopener noreferrer" className="text-brand-blue underline break-all">{joinLink}</a>
            </div>
          )}
        </div>

        <aside className="card space-y-5 p-6 md:sticky md:top-24">
          <RegistrationActions event={event} mine={mine} onChanged={load} align="start" />
          {event.capacity !== null && (
            <div>
              <div className="h-2 rounded-full bg-mist" role="img" aria-label={`${pctFull}% of places taken`}>
                <div className="h-2 rounded-full bg-brand-sky" style={{ width: `${pctFull}%` }} />
              </div>
              <p className="mt-2 text-xs text-mute">
                {event.spotsLeft === 0 ? (event.waitlistEnabled ? `Full · ${event.waitlisted} on waitlist` : "Full") : `${event.spotsLeft} of ${event.capacity} places left`}
              </p>
            </div>
          )}
          {event.status !== "cancelled" && (
            <AddToCalendar event={event} ticketCode={mine?.status === "confirmed" ? mine.ticketCode : undefined} />
          )}
          {active && <p className="text-xs text-mute">You can manage all your bookings under Your membership.</p>}
          <Link to="/events" className="block text-sm font-semibold text-brand-blue underline underline-offset-4">← All events</Link>
        </aside>
      </div>
    </div>
  );
}

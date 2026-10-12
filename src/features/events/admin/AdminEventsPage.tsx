import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import PageHeader from "../../../components/ui/PageHeader";
import { useNow } from "../../../lib/useNow";
import { eventsApi } from "../api";
import { isActive } from "./ActiveEvents";
import LiveBadge from "../LiveBadge";
import { eventEnd, formatEventDate, formatEventTime, isHappeningNow } from "../types";
import type { EventItem, EventStatus } from "../types";

const FILTERS = ["active", "draft", "cancelled", "past", "all"] as const;
type Filter = (typeof FILTERS)[number];
const LABELS: Record<Filter, string> = { active: "Active", draft: "Drafts", cancelled: "Cancelled", past: "Past", all: "All" };
const EMPTY: Record<Filter, string> = {
  active: "No events are active on the site right now.",
  draft: "No drafts.",
  cancelled: "No cancelled events.",
  past: "No past events yet.",
  all: "No events yet.",
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [filter, setFilter] = useState<Filter>("active");
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState<EventItem | null>(null);
  const [deleting, setDeleting] = useState<EventItem | null>(null);
  const now = useNow();

  const refresh = async () => setEvents(await eventsApi.listAll());

  useEffect(() => {
    refresh().catch((err) => setError(err instanceof Error ? err.message : "Could not load events."));
  }, []);

  const changeStatus = async (event: EventItem, status: EventStatus) => {
    setError("");
    try {
      await eventsApi.setStatus(event.id, status);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update the event.");
    }
  };

  const remove = async (event: EventItem) => {
    setError("");
    try {
      await eventsApi.remove(event.id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete the event.");
    }
  };

  const live = events.filter((e) => isHappeningNow(e, now));
  const matches: Record<Filter, (e: EventItem) => boolean> = {
    active: (e) => isActive(e, now),
    draft: (e) => e.status === "draft",
    cancelled: (e) => e.status === "cancelled",
    past: (e) => e.status === "published" && eventEnd(e) <= now,
    all: () => true,
  };
  const visible = events.filter(matches[filter]).filter((e) => !isHappeningNow(e, now));

  return (
    <div className="page-transition">
      <PageHeader
        eyebrow="Staff only"
        title="Events"
        width="max-w-6xl"
        action={
          <Link to="/admin/events/new" className="btn btn-primary">
            New event
          </Link>
        }
      />
      <div className="max-w-6xl mx-auto px-6 py-10">
        {live.length > 0 && (
          <section aria-labelledby="admin-live" className="mb-8">
            <h2 id="admin-live" className="sr-only">Happening now</h2>
            <div className="grid gap-4">
              {live.map((event) => {
                const until = new Date(event.endsAt ?? new Date(event.startsAt).getTime() + 2 * 3600 * 1000).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });
                return (
                  <article key={event.id} className="flex flex-col gap-4 rounded-[24px] bg-gradient-to-br from-ink to-[#14295a] p-6 text-[#eaf0ff] shadow-card md:flex-row md:items-center md:justify-between">
                    <div>
                      <LiveBadge className="!bg-white/10 !text-[#ff9d95]" />
                      <p className="mt-3 font-display text-2xl font-medium tracking-tight text-white">{event.title}</p>
                      <p className="mt-1 text-sm text-[#c4d2f0]">
                        On until {until} · {event.taken}
                        {event.capacity !== null ? ` / ${event.capacity}` : ""} registered
                        {event.waitlisted > 0 ? ` · ${event.waitlisted} waitlisted` : ""}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link to={`/admin/events/${event.id}`} className="btn btn-light btn-sm">Attendees &amp; check-in</Link>
                      <button type="button" className="btn btn-sm bg-white/10 text-white hover:bg-white/20" onClick={() => setConfirming(event)}>Cancel event</button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${filter === f ? "bg-ink text-white" : "bg-mist text-ink hover:bg-line"}`}
            >
              {LABELS[f]} <span className={filter === f ? "opacity-70" : "text-mute"}>{events.filter(matches[f]).length}</span>
            </button>
          ))}
        </div>
        {error && <p role="alert" className="text-brand-red mb-4">{error}</p>}
        <div className="card overflow-hidden">
          {visible.map((event) => (
            <div key={event.id} className="flex flex-col md:flex-row md:items-center gap-3 px-6 py-4 border-b border-line last:border-0">
              <div className="flex-1">
                <p className="font-semibold text-ink">{event.title}</p>
                <p className="text-xs text-mute mt-1">
                  {isHappeningNow(event, now) ? "live now" : event.status === "published" ? (eventEnd(event) <= now ? "past" : "active") : event.status} · {event.category} · {formatEventDate(event.startsAt)} {formatEventTime(event.startsAt, event.endsAt)} ·{" "}
                  {event.taken}
                  {event.capacity !== null ? ` / ${event.capacity}` : ""} registered
                  {event.waitlisted > 0 ? ` · ${event.waitlisted} waitlisted` : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to={`/admin/events/${event.id}`} className="btn btn-outline btn-sm">
                  Edit &amp; attendees
                </Link>
                {event.status === "draft" && (
                  <button type="button" className="btn btn-green btn-sm" onClick={() => void changeStatus(event, "published")}>
                    Publish
                  </button>
                )}
                {event.status === "published" && (
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => setConfirming(event)}>
                    Cancel event
                  </button>
                )}
                {event.status === "cancelled" && (
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => void changeStatus(event, "published")}>
                    Reinstate
                  </button>
                )}
                <button type="button" className="btn btn-danger btn-sm" onClick={() => setDeleting(event)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
          {visible.length === 0 && <p className="p-8 text-mute text-center">{live.length > 0 && filter === "active" ? "No other active events." : EMPTY[filter]}</p>}
        </div>
      </div>
      {deleting && (
        <ConfirmDialog
          danger
          title={`Delete "${deleting.title}"?`}
          message={
            deleting.taken + deleting.waitlisted > 0
              ? `This permanently removes the event and its ${deleting.taken + deleting.waitlisted} registration${deleting.taken + deleting.waitlisted === 1 ? "" : "s"}. Registered members are not told. If the event has not happened yet, cancel it instead so they can see it was cancelled. This cannot be undone.`
              : "This permanently removes the event. This cannot be undone."
          }
          confirmLabel="Delete event"
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            const target = deleting;
            setDeleting(null);
            void remove(target);
          }}
        />
      )}
      {confirming && (
        <ConfirmDialog
          danger
          title={`Cancel "${confirming.title}"?`}
          message="Registered members will see the event as cancelled and can no longer register. You can reinstate it later."
          confirmLabel="Cancel event"
          onCancel={() => setConfirming(null)}
          onConfirm={() => {
            const target = confirming;
            setConfirming(null);
            void changeStatus(target, "cancelled");
          }}
        />
      )}
    </div>
  );
}

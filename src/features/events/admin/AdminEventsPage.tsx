import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import PageHeader from "../../../components/ui/PageHeader";
import { eventsApi } from "../api";
import { formatEventDate, formatEventTime } from "../types";
import type { EventItem, EventStatus } from "../types";

const FILTERS = ["all", "draft", "published", "cancelled"] as const;

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState<EventItem | null>(null);

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

  const visible = filter === "all" ? events : events.filter((e) => e.status === filter);

  return (
    <div className="page-transition min-h-screen bg-[#F4F6FB]">
      <PageHeader
        eyebrow="Staff only"
        title="Events"
        width="max-w-6xl"
        action={
          <Link to="/admin/events/new" className="px-5 py-3 bg-[#CC2229] text-white font-semibold rounded-xl text-center">
            New event
          </Link>
        }
      />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${filter === f ? "bg-[#003580] text-white" : "bg-white border border-gray-200"}`}
            >
              {f}
            </button>
          ))}
        </div>
        {error && <p role="alert" className="text-[#CC2229] mb-4">{error}</p>}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {visible.map((event) => (
            <div key={event.id} className="flex flex-col md:flex-row md:items-center gap-3 px-6 py-4 border-b border-gray-100 last:border-0">
              <div className="flex-1">
                <p className="font-semibold text-[#0D1B2A]">{event.title}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {event.status} · {event.category} · {formatEventDate(event.startsAt)} {formatEventTime(event.startsAt, event.endsAt)} ·{" "}
                  {event.taken}
                  {event.capacity !== null ? ` / ${event.capacity}` : ""} registered
                  {event.waitlisted > 0 ? ` · ${event.waitlisted} waitlisted` : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to={`/admin/events/${event.id}`} className="px-3 py-2 text-sm rounded-lg bg-[#F4F6FB] font-medium">
                  Edit &amp; attendees
                </Link>
                {event.status === "draft" && (
                  <button type="button" className="px-3 py-2 text-sm rounded-lg bg-[#00997A] text-white" onClick={() => void changeStatus(event, "published")}>
                    Publish
                  </button>
                )}
                {event.status === "published" && (
                  <button type="button" className="px-3 py-2 text-sm rounded-lg border border-red-200 text-[#CC2229]" onClick={() => setConfirming(event)}>
                    Cancel event
                  </button>
                )}
                {event.status === "cancelled" && (
                  <button type="button" className="px-3 py-2 text-sm rounded-lg border border-gray-200" onClick={() => void changeStatus(event, "published")}>
                    Reinstate
                  </button>
                )}
              </div>
            </div>
          ))}
          {visible.length === 0 && <p className="p-8 text-gray-400 text-center">No events in this view.</p>}
        </div>
      </div>
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

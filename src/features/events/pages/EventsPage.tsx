import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../../components/ui/PageHeader";
import { categoryColors } from "../../../constants";
import { useAuth } from "../../auth/AuthContext";
import { eventsApi } from "../api";
import RegistrationActions from "../RegistrationActions";
import LiveBadge from "../LiveBadge";
import { useNow } from "../../../lib/useNow";
import { formatEventDate, formatEventTime, isHappeningNow, registrationState } from "../types";
import type { EventItem, EventRegistration } from "../types";

const TONES = ["var(--color-brand-sky)", "var(--color-brand-green)", "var(--color-brand-red)"] as const;

export default function EventsPage() {
  const { profile } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [mine, setMine] = useState<Map<string, EventRegistration>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState("All");
  const now = useNow();

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
  const inCategory = selected === "All" ? events : events.filter((e) => e.category === selected);
  const live = inCategory.filter((e) => isHappeningNow(e, now));
  const visible = inCategory.filter((e) => !isHappeningNow(e, now));

  return (
    <div className="page-transition">
      <PageHeader eyebrow="Calendar" title="Upcoming events" subtitle="Register in one tap and keep your ticket on your phone." />

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {categories.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={selected === t}
              onClick={() => setSelected(t)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-[background-color,color,transform] duration-150 active:scale-95 ${
                selected === t ? "bg-ink text-white" : "bg-mist text-ink hover:bg-line"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {error && <p role="alert" className="mb-6 rounded-2xl bg-brand-red/10 px-4 py-3 text-sm text-brand-red-dark">{error}</p>}

        {live.length > 0 && (
          <section aria-labelledby="live-now" className="mb-12">
            <h2 id="live-now" className="sr-only">Happening now</h2>
            <div className="flex flex-col gap-5">
              {live.map((event) => (
                <LiveEvent key={event.id} event={event} mine={mine.get(event.id)} onChanged={refresh} />
              ))}
            </div>
          </section>
        )}

        {!loading && live.length > 0 && visible.length > 0 && <h2 className="display mb-5 text-3xl">Coming up</h2>}

        {loading ? (
          <p className="text-mute">Loading events…</p>
        ) : visible.length === 0 && live.length > 0 ? null : visible.length === 0 ? (
          <div className="card px-6 py-12 text-center">
            <p className="font-display text-2xl tracking-tight">No upcoming events right now</p>
            <p className="mt-1 text-mute">New dates are added here as soon as they are confirmed.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {visible.map((event, i) => (
              <EventRow key={event.id} event={event} mine={mine.get(event.id)} onChanged={refresh} tone={TONES[i % TONES.length]} />
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
  tone,
}: {
  event: EventItem;
  mine: EventRegistration | undefined;
  onChanged: () => Promise<void>;
  tone: string;
}) {
  const state = registrationState(event, mine);
  const almostFull = event.spotsLeft !== null && event.spotsLeft > 0 && event.spotsLeft <= 20;
  const pctFull = event.capacity ? Math.round((event.taken / event.capacity) * 100) : 0;
  const day = new Date(event.startsAt).toLocaleDateString("en-GB", { day: "2-digit", timeZone: "Europe/London" });
  const month = new Date(event.startsAt).toLocaleDateString("en-GB", { month: "short", timeZone: "Europe/London" });

  return (
    <article style={{ ["--c" as string]: tone }} className="card relative grid gap-5 py-6 pl-6 pr-6 sm:grid-cols-[84px_1fr] md:grid-cols-[84px_1fr_auto] md:items-start">
      <span aria-hidden="true" className="absolute bottom-[18px] left-0 top-[18px] w-[5px] rounded-r-[5px] bg-[var(--c)]" />
      <div className="flex items-baseline gap-2 sm:grid sm:place-items-center sm:border-r-2 sm:border-dotted sm:border-brand-blue/20 sm:pr-5 sm:text-center sm:leading-none" aria-hidden="true">
        <b className="font-display text-4xl font-medium tracking-tight text-[var(--c)] sm:text-[2.4rem]">{day}</b>
        <i className="font-label text-[0.7rem] font-semibold uppercase not-italic tracking-[0.16em] text-mute sm:-mt-4">{month}</i>
      </div>

      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={`chip ${categoryColors[event.category] || "bg-mist text-ink"}`}>{event.category}</span>
          {almostFull && state !== "cancelled-event" && <span className="chip bg-amber-100 text-amber-800">Almost full</span>}
          {state === "cancelled-event" && <span className="chip bg-brand-red/10 text-brand-red-dark">Cancelled</span>}
        </div>
        <h2 className="font-display text-[1.6rem] font-medium leading-tight tracking-tight">
          <Link to={`/events/${event.slug}`} className="transition-colors hover:text-brand-blue">{event.title}</Link>
        </h2>
        <p className="mt-1 text-sm text-mute">
          {formatEventDate(event.startsAt)} · {formatEventTime(event.startsAt, event.endsAt)}
          {event.venue ? ` · ${event.venue}` : ""}
        </p>
        <p className="mt-3 line-clamp-3 text-[0.96rem] text-mute">{event.description}</p>
        {event.capacity !== null && (
          <div className="mt-4 flex items-center gap-4">
            <div className="h-2 max-w-xs flex-1 rounded-full bg-mist" role="img" aria-label={`${pctFull}% of places taken`}>
              <div className="h-2 rounded-full bg-brand-sky" style={{ width: `${pctFull}%` }} />
            </div>
            <span className="text-xs text-mute">
              {event.spotsLeft === 0 ? (event.waitlistEnabled ? `Full · ${event.waitlisted} on waitlist` : "Full") : `${event.spotsLeft} spots left`}
            </span>
          </div>
        )}
      </div>

      <div className="flex min-w-44 flex-col items-start gap-3 sm:col-start-2 md:col-start-3 md:items-end">
        <RegistrationActions event={event} mine={mine} onChanged={onChanged} />
        <Link to={`/events/${event.slug}`} className="text-sm font-semibold text-brand-blue underline underline-offset-4">Details</Link>
      </div>
    </article>
  );
}

/** An event that is on right now: set apart on a dark band, with the same register or details actions. */
function LiveEvent({ event, mine, onChanged }: { event: EventItem; mine: EventRegistration | undefined; onChanged: () => Promise<void> }) {
  const until = new Date(event.endsAt ?? new Date(event.startsAt).getTime() + 2 * 3600 * 1000).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });
  return (
    <article className="rounded-[28px] bg-gradient-to-br from-ink to-[#14295a] p-6 text-[#eaf0ff] shadow-card sm:p-8">
      <LiveBadge className="!bg-white/10 !text-[#ff9d95]" />
      <div className="mt-4 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <h3 className="display text-3xl text-white sm:text-4xl">
            <Link to={`/events/${event.slug}`} className="transition-colors hover:text-[#cfe0ff]">{event.title}</Link>
          </h3>
          <p className="mt-2 text-[#c4d2f0]">
            On until {until}
            {event.venue ? ` · ${event.venue}` : ""}
          </p>
          {event.description && <p className="mt-3 line-clamp-2 max-w-2xl text-[#c4d2f0]">{event.description}</p>}
        </div>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <div className="[&_.chip]:bg-white/10 [&_.chip]:text-white [&_span.text-xs]:text-[#c4d2f0] [&_button.text-brand-red]:text-[#ff9d95] [&_p]:text-[#ff9d95] [&_.btn-blue]:bg-white [&_.btn-blue]:text-brand-blue">
            <RegistrationActions event={event} mine={mine} onChanged={onChanged} />
          </div>
          <Link to={`/events/${event.slug}`} className="text-sm font-semibold text-white underline underline-offset-4">Details</Link>
        </div>
      </div>
    </article>
  );
}

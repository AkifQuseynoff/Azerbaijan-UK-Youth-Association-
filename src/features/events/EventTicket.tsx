import { Link } from "react-router-dom";
import { formatEventTime } from "./types";
import type { EventItem } from "./types";

const TONES = ["var(--color-brand-sky)", "var(--color-brand-green)", "var(--color-brand-red)"] as const;

function day(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", timeZone: "Europe/London" });
}
function month(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { month: "short", timeZone: "Europe/London" });
}

/** The short availability line for a ticket. */
export function availability(event: EventItem): string {
  if (event.status === "cancelled") return "Cancelled";
  if (event.spotsLeft === null) return "Open to all";
  if (event.spotsLeft <= 0) return event.waitlistEnabled ? "Waitlist open" : "Full";
  if (event.spotsLeft <= 5) return `Only ${event.spotsLeft} left`;
  return `${event.spotsLeft} places`;
}

/** A calendar entry: a colour spine, the date, the title and where, and how many places are left. */
export default function EventTicket({ event, index = 0 }: { event: EventItem; index?: number }) {
  const tone = TONES[index % TONES.length];
  return (
    <Link
      to={`/events/${event.slug}`}
      style={{ ["--c" as string]: tone }}
      className="press group relative grid grid-cols-[76px_1fr] items-center gap-x-5 gap-y-1.5 rounded-[22px] bg-white py-6 pl-5 pr-6 shadow-card ring-1 ring-line"
    >
      <span aria-hidden="true" className="absolute bottom-[18px] left-0 top-[18px] w-[5px] rounded-r-[5px] bg-[var(--c)]" />
      <span className="row-span-2 grid place-items-center self-stretch border-r-2 border-dotted border-brand-blue/20 pr-5 text-center leading-none">
        <b className="font-display text-[2.2rem] font-medium tracking-tight text-[var(--c)]">{day(event.startsAt)}</b>
        <i className="-mt-3.5 font-label text-[0.7rem] font-semibold uppercase not-italic tracking-[0.16em] text-mute">{month(event.startsAt)}</i>
      </span>
      <span>
        <strong className="block font-display text-[1.28rem] font-medium leading-tight tracking-tight">{event.title}</strong>
        <em className="text-[0.94rem] not-italic text-mute">
          {formatEventTime(event.startsAt, event.endsAt)}
          {event.venue ? ` · ${event.venue}` : ""}
        </em>
      </span>
      <span className="chip justify-self-start bg-[color-mix(in_srgb,var(--c)_11%,white)] text-[var(--c)]">{availability(event)}</span>
    </Link>
  );
}

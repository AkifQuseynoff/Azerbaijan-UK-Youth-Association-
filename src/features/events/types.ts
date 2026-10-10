export type EventCategory = "Culture" | "Education" | "Networking" | "Leadership" | "Community" | "Podcast";
export type EventKind = "event" | "podcast_live";
export type EventStatus = "draft" | "published" | "cancelled";
export type RegistrationStatus = "confirmed" | "waitlisted" | "cancelled" | "attended";

export const EVENT_CATEGORIES: EventCategory[] = ["Culture", "Education", "Networking", "Leadership", "Community", "Podcast"];

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  kind: EventKind;
  category: EventCategory;
  startsAt: string;
  endsAt: string | null;
  venue: string;
  /** null means unlimited places */
  capacity: number | null;
  waitlistEnabled: boolean;
  registrationOpensAt: string | null;
  registrationClosesAt: string | null;
  status: EventStatus;
  /** places left; null when capacity is unlimited */
  spotsLeft: number | null;
  taken: number;
  waitlisted: number;
}

export interface EventInput {
  slug: string;
  title: string;
  description: string;
  kind: EventKind;
  category: EventCategory;
  startsAt: string;
  endsAt: string | null;
  venue: string;
  capacity: number | null;
  waitlistEnabled: boolean;
  registrationOpensAt: string | null;
  registrationClosesAt: string | null;
  status: EventStatus;
  onlineUrl: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  status: RegistrationStatus;
  ticketCode: string;
  createdAt: string;
}

export interface Attendee {
  registrationId: string;
  userId: string;
  status: RegistrationStatus;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ticketCode: string;
  registeredAt: string;
  checkedInAt: string | null;
}

/** What the register button should offer, derived from event + the viewer's registration. */
export type RegistrationState =
  | "cancelled-event"
  | "past"
  | "not-open"
  | "closed"
  | "registered"
  | "attended"
  | "waitlisted"
  | "full"
  | "join-waitlist"
  | "open";

export function registrationState(
  event: EventItem,
  mine: EventRegistration | undefined,
  now = Date.now(),
): RegistrationState {
  if (event.status === "cancelled") return "cancelled-event";
  if (mine?.status === "confirmed") return "registered";
  if (mine?.status === "attended") return "attended";
  if (mine?.status === "waitlisted") return "waitlisted";
  if (new Date(event.endsAt ?? event.startsAt).getTime() <= now) return "past";
  if (event.registrationOpensAt && now < new Date(event.registrationOpensAt).getTime()) return "not-open";
  if (event.registrationClosesAt && now > new Date(event.registrationClosesAt).getTime()) return "closed";
  if (event.spotsLeft !== null && event.spotsLeft <= 0) return event.waitlistEnabled ? "join-waitlist" : "full";
  return "open";
}

export function formatEventDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Europe/London",
  });
}

export function formatEventTime(startsAt: string, endsAt: string | null): string {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });
  return endsAt ? `${fmt(startsAt)} – ${fmt(endsAt)}` : fmt(startsAt);
}

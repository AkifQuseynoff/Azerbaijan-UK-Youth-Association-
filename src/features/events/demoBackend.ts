import type { EventsBackend } from "./api";
import type { Attendee, EventCategory, EventItem, EventKind, EventRegistration, RegistrationStatus } from "./types";

// Demo mode only: a localStorage stand-in that mirrors the rules enforced by the
// register/cancel functions in supabase/migrations/005_events.sql.
const EVENTS_KEY = "auya_events";
const REGS_KEY = "auya_event_regs";
const USERS_KEY = "auya_local_users"; // owned by AuthContext

type StoredEvent = Omit<EventItem, "spotsLeft" | "taken" | "waitlisted"> & { onlineUrl: string };
type StoredReg = EventRegistration & { userId: string; checkedInAt: string | null };

function at(daysAhead: number, hour: number, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function seedEvent(slug: string, title: string, description: string, kind: EventKind, category: EventCategory, day: number, from: number, to: number, venue: string, capacity: number): StoredEvent {
  return {
    id: crypto.randomUUID(), slug, title, description, kind, category,
    startsAt: at(day, from), endsAt: at(day, to), venue, capacity,
    waitlistEnabled: true, registrationOpensAt: null, registrationClosesAt: null,
    status: "published", onlineUrl: "",
  };
}

function seedEvents(): StoredEvent[] {
  return [
    seedEvent("cultural-festival-2026", "Cultural Festival 2026", "Our flagship annual event celebrating Azerbaijani culture through music, dance, traditional crafts, and authentic cuisine.", "event", "Culture", 21, 12, 20, "Southbank Centre, London", 800),
    seedEvent("azerbaijani-language-classes-autumn", "Azerbaijani Language Classes: Autumn Term", "Free weekly Azerbaijani language classes for all levels, taught by certified language tutors.", "event", "Education", 8, 10, 12, "Camden Community Centre, London", 30),
    seedEvent("career-networking-night-finance-law", "Career Networking Night: Finance & Law", "An evening connecting Azerbaijani professionals in the City, with a keynote followed by structured networking.", "event", "Networking", 14, 18, 21, "The Gherkin, 30 St Mary Axe, London", 120),
    seedEvent("podcast-live-recording-diaspora-voices", "Podcast Live Recording: Diaspora Voices", "Join us in the audience for a live recording of our podcast, with time for questions at the end.", "podcast_live", "Podcast", 18, 19, 21, "Studio 3, London", 2),
  ];
}

function read<T>(key: string, fallback: () => T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    /* fall through to the seed */
  }
  const value = fallback();
  write(key, value);
  return value;
}

function write(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

const loadEvents = () => read<StoredEvent[]>(EVENTS_KEY, seedEvents);
const loadRegs = () => read<StoredReg[]>(REGS_KEY, () => []);

const isTaken = (s: RegistrationStatus) => s === "confirmed" || s === "attended";

function toItem(event: StoredEvent, regs: StoredReg[]): EventItem {
  const mine = regs.filter((r) => r.eventId === event.id);
  const taken = mine.filter((r) => isTaken(r.status)).length;
  const { onlineUrl: _onlineUrl, ...rest } = event;
  return {
    ...rest,
    taken,
    waitlisted: mine.filter((r) => r.status === "waitlisted").length,
    spotsLeft: event.capacity === null ? null : Math.max(event.capacity - taken, 0),
  };
}

function promoteWaitlist(eventId: string, events: StoredEvent[], regs: StoredReg[]) {
  const event = events.find((e) => e.id === eventId);
  if (!event || event.status !== "published") return;
  const queue = regs.filter((r) => r.eventId === eventId && r.status === "waitlisted").sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  let taken = regs.filter((r) => r.eventId === eventId && isTaken(r.status)).length;
  for (const reg of queue) {
    if (event.capacity !== null && taken >= event.capacity) break;
    reg.status = "confirmed";
    taken += 1;
  }
}

function userDirectory(): Map<string, { firstName: string; lastName: string; email: string; phone: string }> {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]") as { id: string; email: string; profile: { firstName: string; lastName: string; phone: string } }[];
    return new Map(users.map((u) => [u.id, { firstName: u.profile.firstName, lastName: u.profile.lastName, email: u.email, phone: u.profile.phone }]));
  } catch {
    return new Map();
  }
}

export const demoBackend: EventsBackend = {
  async listUpcoming() {
    const regs = loadRegs();
    const now = Date.now();
    return loadEvents()
      .filter((e) => e.status !== "draft" && new Date(e.endsAt ?? e.startsAt).getTime() > now)
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
      .map((e) => toItem(e, regs));
  },

  async myRegistrations(userId) {
    return loadRegs()
      .filter((r) => r.userId === userId && r.status !== "cancelled")
      .map(({ userId: _u, checkedInAt: _c, ...reg }) => reg);
  },

  async register(eventId, userId) {
    const events = loadEvents();
    const regs = loadRegs();
    const event = events.find((e) => e.id === eventId);
    if (!event || event.status !== "published") throw new Error("This event is not open for registration.");
    const now = Date.now();
    if (new Date(event.endsAt ?? event.startsAt).getTime() <= now) throw new Error("This event has already taken place.");
    if (event.registrationOpensAt && now < new Date(event.registrationOpensAt).getTime()) throw new Error("Registration has not opened yet.");
    if (event.registrationClosesAt && now > new Date(event.registrationClosesAt).getTime()) throw new Error("Registration for this event has closed.");

    const existing = regs.find((r) => r.eventId === eventId && r.userId === userId);
    if (existing && existing.status !== "cancelled") return existing;

    const taken = regs.filter((r) => r.eventId === eventId && isTaken(r.status)).length;
    let status: RegistrationStatus;
    if (event.capacity === null || taken < event.capacity) status = "confirmed";
    else if (event.waitlistEnabled) status = "waitlisted";
    else throw new Error("This event is full.");

    const createdAt = new Date().toISOString();
    if (existing) {
      Object.assign(existing, { status, createdAt });
      write(REGS_KEY, regs);
      return existing;
    }
    const reg: StoredReg = {
      id: crypto.randomUUID(), eventId, userId, status, createdAt, checkedInAt: null,
      ticketCode: crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase(),
    };
    write(REGS_KEY, [...regs, reg]);
    return reg;
  },

  async cancel(eventId, userId) {
    const regs = loadRegs();
    const reg = regs.find((r) => r.eventId === eventId && r.userId === userId && (r.status === "confirmed" || r.status === "waitlisted"));
    if (reg) reg.status = "cancelled";
    promoteWaitlist(eventId, loadEvents(), regs);
    write(REGS_KEY, regs);
  },

  async listAll() {
    const regs = loadRegs();
    return loadEvents().sort((a, b) => b.startsAt.localeCompare(a.startsAt)).map((e) => toItem(e, regs));
  },

  async getForEdit(id) {
    const event = loadEvents().find((e) => e.id === id);
    return event ? { event: toItem(event, loadRegs()), onlineUrl: event.onlineUrl } : null;
  },

  async save(id, input) {
    const events = loadEvents();
    if (events.some((e) => e.slug === input.slug && e.id !== id)) {
      throw new Error("Another event already uses that web address (slug).");
    }
    const { onlineUrl, ...fields } = input;
    let saved: StoredEvent;
    if (id) {
      const current = events.find((e) => e.id === id);
      if (!current) throw new Error("Event not found.");
      saved = Object.assign(current, fields, { onlineUrl });
    } else {
      saved = { id: crypto.randomUUID(), ...fields, onlineUrl };
      events.unshift(saved);
    }
    const regs = loadRegs();
    promoteWaitlist(saved.id, events, regs);
    write(EVENTS_KEY, events);
    write(REGS_KEY, regs);
    return toItem(saved, regs);
  },

  async setStatus(id, status) {
    const events = loadEvents();
    const event = events.find((e) => e.id === id);
    if (!event) return;
    event.status = status;
    const regs = loadRegs();
    promoteWaitlist(id, events, regs);
    write(EVENTS_KEY, events);
    write(REGS_KEY, regs);
  },

  async listAttendees(eventId) {
    const directory = userDirectory();
    return loadRegs()
      .filter((r) => r.eventId === eventId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map((r): Attendee => {
        const person = directory.get(r.userId);
        return {
          registrationId: r.id, userId: r.userId, status: r.status,
          firstName: person?.firstName ?? "Member", lastName: person?.lastName ?? r.userId.slice(0, 6),
          email: person?.email ?? "", phone: person?.phone ?? "",
          ticketCode: r.ticketCode, registeredAt: r.createdAt, checkedInAt: r.checkedInAt,
        };
      });
  },

  async setRegistrationStatus(registrationId, status) {
    const regs = loadRegs();
    const reg = regs.find((r) => r.id === registrationId);
    if (!reg) throw new Error("Registration not found.");
    reg.status = status;
    if (status === "attended") reg.checkedInAt = new Date().toISOString();
    promoteWaitlist(reg.eventId, loadEvents(), regs);
    write(REGS_KEY, regs);
  },
};

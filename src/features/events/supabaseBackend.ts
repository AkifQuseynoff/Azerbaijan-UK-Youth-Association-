import { supabase } from "../../lib/supabase";
import type { EventsBackend } from "./api";
import type { Attendee, EventCategory, EventItem, EventKind, EventRegistration, EventStatus, RegistrationStatus } from "./types";

type EventRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  kind: EventKind;
  category: EventCategory;
  starts_at: string;
  ends_at: string | null;
  venue: string;
  capacity: number | null;
  waitlist_enabled: boolean;
  registration_opens_at: string | null;
  registration_closes_at: string | null;
  status: EventStatus;
};

type AvailabilityRow = { event_id: string; spots_left: number | null; taken: number; waitlisted: number };

type RegistrationRow = {
  id: string;
  event_id: string;
  status: RegistrationStatus;
  ticket_code: string;
  created_at: string;
};

type AttendeeRow = {
  registration_id: string;
  user_id: string;
  status: RegistrationStatus;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  ticket_code: string;
  registered_at: string;
  checked_in_at: string | null;
};

function db() {
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase;
}

/** PostgREST errors are plain objects, not Error instances; normalise them for the UI. */
function fail(error: { message: string; code?: string }): never {
  if (error.code === "23505") throw new Error("Another event already uses that web address (slug).");
  throw new Error(error.message);
}

function toEvent(row: EventRow, availability?: AvailabilityRow): EventItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    kind: row.kind,
    category: row.category,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    venue: row.venue,
    capacity: row.capacity,
    waitlistEnabled: row.waitlist_enabled,
    registrationOpensAt: row.registration_opens_at,
    registrationClosesAt: row.registration_closes_at,
    status: row.status,
    spotsLeft: availability ? availability.spots_left : row.capacity,
    taken: availability?.taken ?? 0,
    waitlisted: availability?.waitlisted ?? 0,
  };
}

async function withAvailability(rows: EventRow[]): Promise<EventItem[]> {
  if (rows.length === 0) return [];
  const { data, error } = await db()
    .from("event_availability")
    .select("event_id, spots_left, taken, waitlisted")
    .in("event_id", rows.map((r) => r.id));
  if (error) fail(error);
  const byId = new Map(((data ?? []) as AvailabilityRow[]).map((a) => [a.event_id, a]));
  return rows.map((r) => toEvent(r, byId.get(r.id)));
}

function toRegistration(row: RegistrationRow): EventRegistration {
  return { id: row.id, eventId: row.event_id, status: row.status, ticketCode: row.ticket_code, createdAt: row.created_at };
}

export const supabaseBackend: EventsBackend = {
  async listUpcoming() {
    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
    const { data, error } = await db()
      .from("events")
      .select("*")
      .in("status", ["published", "cancelled"])
      .gte("starts_at", since)
      .order("starts_at");
    if (error) fail(error);
    const now = Date.now();
    const rows = ((data ?? []) as EventRow[]).filter((r) => new Date(r.ends_at ?? r.starts_at).getTime() > now);
    return withAvailability(rows);
  },

  async getBySlug(slug) {
    const { data, error } = await db().from("events").select("*").eq("slug", slug).in("status", ["published", "cancelled"]).maybeSingle();
    if (error) fail(error);
    if (!data) return null;
    const [event] = await withAvailability([data as EventRow]);
    return event;
  },

  async myUpcoming(userId) {
    const { data, error } = await db()
      .from("event_registrations")
      .select("id, event_id, status, ticket_code, created_at")
      .eq("user_id", userId)
      .in("status", ["confirmed", "waitlisted"]);
    if (error) fail(error);
    const regs = (data ?? []) as RegistrationRow[];
    if (regs.length === 0) return [];
    const { data: rows, error: eventError } = await db().from("events").select("*").in("id", regs.map((r) => r.event_id));
    if (eventError) fail(eventError);
    const events = await withAvailability((rows ?? []) as EventRow[]);
    const byId = new Map(events.map((e) => [e.id, e]));
    const now = Date.now();
    return regs
      .map((r) => ({ registration: toRegistration(r), event: byId.get(r.event_id) }))
      .filter((x): x is { registration: EventRegistration; event: EventItem } => Boolean(x.event))
      .filter((x) => new Date(x.event.endsAt ?? x.event.startsAt).getTime() > now)
      .sort((a, b) => a.event.startsAt.localeCompare(b.event.startsAt));
  },

  async getJoinLink(eventId) {
    // Row level security only returns this row to staff and members with a confirmed place.
    const { data, error } = await db().from("event_links").select("online_url").eq("event_id", eventId).maybeSingle();
    if (error) fail(error);
    return (data as { online_url: string | null } | null)?.online_url ?? null;
  },

  async myRegistrations(userId) {
    const { data, error } = await db()
      .from("event_registrations")
      .select("id, event_id, status, ticket_code, created_at")
      .eq("user_id", userId)
      .neq("status", "cancelled");
    if (error) fail(error);
    return ((data ?? []) as RegistrationRow[]).map(toRegistration);
  },

  async register(eventId, _userId, answers = {}) {
    const { data, error } = await db().rpc("register_for_event", { p_event_id: eventId, p_answers: answers });
    if (error) fail(error);
    return toRegistration(data as RegistrationRow);
  },

  async cancel(eventId) {
    const { error } = await db().rpc("cancel_registration", { p_event_id: eventId });
    if (error) fail(error);
  },

  async listAll() {
    const { data, error } = await db().from("events").select("*").order("starts_at", { ascending: false });
    if (error) fail(error);
    return withAvailability((data ?? []) as EventRow[]);
  },

  async getForEdit(id) {
    const { data, error } = await db().from("events").select("*").eq("id", id).maybeSingle();
    if (error) fail(error);
    if (!data) return null;
    const [event] = await withAvailability([data as EventRow]);
    const { data: link, error: linkError } = await db().from("event_links").select("online_url").eq("event_id", id).maybeSingle();
    if (linkError) fail(linkError);
    return { event, onlineUrl: (link as { online_url: string | null } | null)?.online_url ?? "" };
  },

  async save(id, input, userId) {
    const payload = {
      slug: input.slug,
      title: input.title,
      description: input.description,
      kind: input.kind,
      category: input.category,
      starts_at: input.startsAt,
      ends_at: input.endsAt,
      venue: input.venue,
      capacity: input.capacity,
      waitlist_enabled: input.waitlistEnabled,
      registration_opens_at: input.registrationOpensAt,
      registration_closes_at: input.registrationClosesAt,
      status: input.status,
      ...(id ? {} : { created_by: userId }),
    };
    const query = id
      ? db().from("events").update(payload).eq("id", id)
      : db().from("events").insert(payload);
    const { data, error } = await query.select("*").single();
    if (error) fail(error);
    const row = data as EventRow;

    const url = input.onlineUrl.trim();
    if (url) {
      const { error: linkError } = await db().from("event_links").upsert({ event_id: row.id, online_url: url });
      if (linkError) fail(linkError);
    } else if (id) {
      const { error: linkError } = await db().from("event_links").delete().eq("event_id", row.id);
      if (linkError) fail(linkError);
    }
    const [event] = await withAvailability([row]);
    return event;
  },

  async setStatus(id, status) {
    const { error } = await db().from("events").update({ status }).eq("id", id);
    if (error) fail(error);
  },

  async listAttendees(eventId) {
    const { data, error } = await db().rpc("event_attendees", { p_event_id: eventId });
    if (error) fail(error);
    return ((data ?? []) as AttendeeRow[]).map(
      (r): Attendee => ({
        registrationId: r.registration_id,
        userId: r.user_id,
        status: r.status,
        firstName: r.first_name,
        lastName: r.last_name,
        email: r.email,
        phone: r.phone ?? "",
        ticketCode: r.ticket_code,
        registeredAt: r.registered_at,
        checkedInAt: r.checked_in_at,
      }),
    );
  },

  async setRegistrationStatus(registrationId, status) {
    const { error } = await db().rpc("admin_set_registration_status", { p_registration_id: registrationId, p_status: status });
    if (error) fail(error);
  },
};

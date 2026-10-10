import { isSupabaseConfigured, supabase } from "../../lib/supabase";
import { demoBackend } from "./demoBackend";
import { supabaseBackend } from "./supabaseBackend";
import type { Attendee, EventInput, EventItem, EventRegistration, EventStatus } from "./types";

/**
 * One contract, two implementations: Supabase for real deployments and a
 * localStorage store for explicit demo mode. Pages only ever talk to `eventsApi`.
 * `userId` is used by the demo store only; Supabase takes the user from the session.
 */
export interface EventsBackend {
  /** Upcoming published and cancelled events, soonest first. */
  listUpcoming(): Promise<EventItem[]>;
  myRegistrations(userId: string): Promise<EventRegistration[]>;
  register(eventId: string, userId: string, answers?: Record<string, string>): Promise<EventRegistration>;
  cancel(eventId: string, userId: string): Promise<void>;

  // staff
  listAll(): Promise<EventItem[]>;
  getForEdit(id: string): Promise<{ event: EventItem; onlineUrl: string } | null>;
  save(id: string | null, input: EventInput, userId: string | null): Promise<EventItem>;
  setStatus(id: string, status: EventStatus): Promise<void>;
  listAttendees(eventId: string): Promise<Attendee[]>;
  setRegistrationStatus(registrationId: string, status: "cancelled" | "attended"): Promise<void>;
}

export const eventsApi: EventsBackend = supabase && isSupabaseConfigured ? supabaseBackend : demoBackend;

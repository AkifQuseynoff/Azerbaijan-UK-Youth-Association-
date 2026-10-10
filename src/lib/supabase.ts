import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * Demo mode swaps the backend for browser localStorage. It must be switched on
 * explicitly (VITE_DEMO_MODE=true) and is ignored whenever Supabase is configured,
 * so a production build can never fall back to fake auth by accident.
 */
export const isDemoMode = !isSupabaseConfigured && import.meta.env.VITE_DEMO_MODE === "true";

/** Neither a backend nor demo mode: the app refuses to run rather than fake it. */
export const isMisconfigured = !isSupabaseConfigured && !isDemoMode;

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

import { isSupabaseConfigured, supabase } from "../../lib/supabase";

/** Public facts about the association that admins edit under Site details. Empty values are simply not shown. */
export interface SiteSettings {
  about: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  contactHours: string;
  instagramUrl: string;
  facebookUrl: string;
  linkedinUrl: string;
}

export const EMPTY_SETTINGS: SiteSettings = {
  about: "",
  contactEmail: "",
  contactPhone: "",
  contactAddress: "",
  contactHours: "",
  instagramUrl: "",
  facebookUrl: "",
  linkedinUrl: "",
};

type Row = {
  about: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  contact_hours: string;
  instagram_url: string;
  facebook_url: string;
  linkedin_url: string;
};

const LOCAL_KEY = "auya_site_settings";
const live = () => Boolean(supabase && isSupabaseConfigured);

function fromRow(r: Row): SiteSettings {
  return {
    about: r.about, contactEmail: r.contact_email, contactPhone: r.contact_phone,
    contactAddress: r.contact_address, contactHours: r.contact_hours, instagramUrl: r.instagram_url,
    facebookUrl: r.facebook_url, linkedinUrl: r.linkedin_url,
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (supabase && live()) {
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (error) throw error;
    return data ? fromRow(data as Row) : EMPTY_SETTINGS;
  }
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) return { ...EMPTY_SETTINGS, ...(JSON.parse(raw) as Partial<SiteSettings>) };
  } catch {
    /* use the defaults */
  }
  return EMPTY_SETTINGS;
}

const https = (v: string) => !v || /^https:\/\//i.test(v);

export async function saveSiteSettings(s: SiteSettings): Promise<void> {
  for (const [label, v] of [["Instagram", s.instagramUrl], ["Facebook", s.facebookUrl], ["LinkedIn", s.linkedinUrl]] as const) {
    if (!https(v.trim())) throw new Error(`${label} link must start with https://`);
  }
  if (s.contactEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.contactEmail.trim())) throw new Error("That email address does not look right.");
  const clean = Object.fromEntries(Object.entries(s).map(([k, v]) => [k, v.trim()])) as unknown as SiteSettings;
  if (supabase && live()) {
    const payload = {
      about: clean.about, contact_email: clean.contactEmail, contact_phone: clean.contactPhone,
      contact_address: clean.contactAddress, contact_hours: clean.contactHours, instagram_url: clean.instagramUrl,
      facebook_url: clean.facebookUrl, linkedin_url: clean.linkedinUrl,
    };
    const { data, error } = await supabase.from("site_settings").update(payload).eq("id", 1).select("id");
    if (error) throw error;
    if (!data || data.length === 0) throw new Error("Could not save. Only admins can change site details, and the latest database update (010) must be applied.");
    return;
  }
  localStorage.setItem(LOCAL_KEY, JSON.stringify(clean));
}

export const hasContact = (s: SiteSettings) => Boolean(s.contactEmail || s.contactPhone || s.contactAddress || s.contactHours);
export const hasSocial = (s: SiteSettings) => Boolean(s.instagramUrl || s.facebookUrl || s.linkedinUrl);

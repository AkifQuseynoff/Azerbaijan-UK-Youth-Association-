import { isSupabaseConfigured, supabase } from "../../lib/supabase";
import { coverPublicUrl, removeCoverFile, uploadCover } from "../news/api";

export type SocietyStatus = "draft" | "published";

/** A university's Azerbaijani society, listed on the Societies page. */
export interface Society {
  id: string;
  slug: string;
  name: string;
  university: string;
  city: string;
  description: string;
  logoPath: string | null;
  logoUrl: string;
  websiteUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  contactEmail: string;
  status: SocietyStatus;
  createdAt: string;
}

export interface SocietyInput {
  slug: string;
  name: string;
  university: string;
  city: string;
  description: string;
  /** The logo already stored for this society (a storage path), kept unless a new file is chosen. */
  logoPath?: string | null;
  logoFile?: File | null;
  websiteUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  contactEmail: string;
  status: SocietyStatus;
}

type Row = {
  id: string; slug: string; name: string; university: string; city: string; description: string; logo_path: string | null;
  website_url: string; instagram_url: string; facebook_url: string; contact_email: string; status: SocietyStatus; created_at: string;
};

const LOCAL_KEY = "auya_societies";
const live = () => Boolean(supabase && isSupabaseConfigured);

function fromRow(r: Row): Society {
  return {
    id: r.id, slug: r.slug, name: r.name, university: r.university, city: r.city, description: r.description,
    logoPath: r.logo_path, logoUrl: coverPublicUrl(r.logo_path), websiteUrl: r.website_url, instagramUrl: r.instagram_url,
    facebookUrl: r.facebook_url, contactEmail: r.contact_email, status: r.status, createdAt: r.created_at,
  };
}

const byName = (a: Society, b: Society) => a.name.localeCompare(b.name, "en", { sensitivity: "base" });

function loadLocal(): Society[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) return JSON.parse(raw) as Society[];
  } catch {
    /* start empty */
  }
  return [];
}
const saveLocal = (list: Society[]) => localStorage.setItem(LOCAL_KEY, JSON.stringify(list));

export async function listPublishedSocieties(): Promise<Society[]> {
  if (supabase && live()) {
    const { data, error } = await supabase.from("societies").select("*").eq("status", "published").order("name");
    if (error) throw error;
    return ((data ?? []) as Row[]).map(fromRow);
  }
  return loadLocal().filter((s) => s.status === "published").sort(byName);
}

export async function getPublishedSociety(slug: string): Promise<Society | null> {
  if (supabase && live()) {
    const { data, error } = await supabase.from("societies").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
    if (error) throw error;
    return data ? fromRow(data as Row) : null;
  }
  return loadLocal().find((s) => s.slug === slug && s.status === "published") ?? null;
}

export async function listStaffSocieties(): Promise<Society[]> {
  if (supabase && live()) {
    const { data, error } = await supabase.from("societies").select("*").order("name");
    if (error) throw error;
    return ((data ?? []) as Row[]).map(fromRow);
  }
  return loadLocal().sort(byName);
}

export async function getStaffSociety(id: string): Promise<Society | null> {
  if (supabase && live()) {
    const { data, error } = await supabase.from("societies").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? fromRow(data as Row) : null;
  }
  return loadLocal().find((s) => s.id === id) ?? null;
}

const isHttps = (v: string) => !v || /^https:\/\//i.test(v);

export async function saveSociety(id: string | null, input: SocietyInput, authorId: string | null): Promise<Society> {
  if (!input.name.trim()) throw new Error("Please enter the society's name.");
  if (!input.university.trim()) throw new Error("Please enter the university.");
  if (!input.slug.trim()) throw new Error("The web address cannot be empty.");
  for (const [label, v] of [["Website", input.websiteUrl], ["Instagram", input.instagramUrl], ["Facebook", input.facebookUrl]] as const) {
    if (!isHttps(v.trim())) throw new Error(`${label} link must start with https://`);
  }
  if (input.contactEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.contactEmail.trim())) throw new Error("That email address does not look right.");

  let logoPath: string | null = input.logoPath ?? null;
  if (input.logoFile) logoPath = await uploadCover(input.logoFile, `society-${input.slug}`);
  const fields = {
    slug: input.slug.trim(), name: input.name.trim(), university: input.university.trim(), city: input.city.trim(),
    description: input.description.trim(), websiteUrl: input.websiteUrl.trim(), instagramUrl: input.instagramUrl.trim(),
    facebookUrl: input.facebookUrl.trim(), contactEmail: input.contactEmail.trim(), status: input.status,
  };

  if (supabase && live()) {
    const payload = {
      slug: fields.slug, name: fields.name, university: fields.university, city: fields.city, description: fields.description,
      logo_path: logoPath, website_url: fields.websiteUrl, instagram_url: fields.instagramUrl, facebook_url: fields.facebookUrl,
      contact_email: fields.contactEmail, status: fields.status, ...(id ? {} : { created_by: authorId }),
    };
    const query = id ? supabase.from("societies").update(payload).eq("id", id) : supabase.from("societies").insert(payload);
    const { data, error } = await query.select("*").single();
    if (error) {
      if (error.code === "23505") throw new Error("Another society already uses that web address. Change it a little, for example by adding the city.");
      throw error;
    }
    return fromRow(data as Row);
  }

  const list = loadLocal();
  if (list.some((s) => s.slug === fields.slug && s.id !== id)) throw new Error("Another society already uses that web address. Change it a little, for example by adding the city.");
  const isUrl = (p: string | null) => Boolean(p && (p.startsWith("http") || p.startsWith("data:")));
  const stored = { ...fields, logoPath, logoUrl: isUrl(logoPath) ? logoPath! : "" };
  if (id) {
    const next = list.map((s) => (s.id === id ? { ...s, ...stored } : s));
    saveLocal(next);
    return next.find((s) => s.id === id)!;
  }
  const created: Society = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...stored };
  saveLocal([created, ...list]);
  return created;
}

export async function setSocietyStatus(id: string, status: SocietyStatus): Promise<void> {
  if (supabase && live()) {
    const { data, error } = await supabase.from("societies").update({ status }).eq("id", id).select("id");
    if (error) throw error;
    if (!data || data.length === 0) throw new Error("Could not update the society.");
    return;
  }
  saveLocal(loadLocal().map((s) => (s.id === id ? { ...s, status } : s)));
}

export async function deleteSociety(id: string): Promise<void> {
  if (supabase && live()) {
    const { data: row } = await supabase.from("societies").select("logo_path").eq("id", id).maybeSingle();
    const { data, error } = await supabase.from("societies").delete().eq("id", id).select("id");
    if (error) throw error;
    if (!data || data.length === 0) throw new Error("The society could not be deleted.");
    await removeCoverFile((row as { logo_path: string | null } | null)?.logo_path ?? null);
    return;
  }
  saveLocal(loadLocal().filter((s) => s.id !== id));
}

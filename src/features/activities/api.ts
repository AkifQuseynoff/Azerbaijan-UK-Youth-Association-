import { isSupabaseConfigured, supabase } from "../../lib/supabase";
import { coverPublicUrl, removeCoverFile, uploadCover } from "../news/api";

export type ActivityStatus = "draft" | "published";

/** One thing the association has done: shown as a card on the home page and the About page. */
export interface Activity {
  id: string;
  title: string;
  summary: string;
  /** ISO date (YYYY-MM-DD) or null */
  happenedOn: string | null;
  linkUrl: string | null;
  coverPath: string | null;
  coverUrl: string;
  status: ActivityStatus;
  createdAt: string;
}

export interface ActivityInput {
  title: string;
  summary: string;
  happenedOn: string | null;
  linkUrl: string | null;
  /** The picture already stored for this activity (a storage path), kept unless a new file is chosen. */
  coverPath?: string | null;
  coverFile?: File | null;
  status: ActivityStatus;
}

type Row = {
  id: string;
  title: string;
  summary: string;
  happened_on: string | null;
  link_url: string | null;
  cover_path: string | null;
  status: ActivityStatus;
  created_at: string;
};

const LOCAL_KEY = "auya_activities";
const live = () => Boolean(supabase && isSupabaseConfigured);

function fromRow(r: Row): Activity {
  return {
    id: r.id, title: r.title, summary: r.summary, happenedOn: r.happened_on, linkUrl: r.link_url,
    coverPath: r.cover_path, coverUrl: coverPublicUrl(r.cover_path), status: r.status, createdAt: r.created_at,
  };
}

const newest = (a: Activity, b: Activity) =>
  (b.happenedOn ?? "").localeCompare(a.happenedOn ?? "") || b.createdAt.localeCompare(a.createdAt);

function loadLocal(): Activity[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) return JSON.parse(raw) as Activity[];
  } catch {
    /* start empty */
  }
  return [];
}
const saveLocal = (list: Activity[]) => localStorage.setItem(LOCAL_KEY, JSON.stringify(list));

export function formatActivityDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export async function listPublishedActivities(limit?: number): Promise<Activity[]> {
  if (supabase && live()) {
    let q = supabase.from("activities").select("*").eq("status", "published").order("happened_on", { ascending: false, nullsFirst: false }).order("created_at", { ascending: false });
    if (limit) q = q.limit(limit);
    const { data, error } = await q;
    if (error) throw error;
    return ((data ?? []) as Row[]).map(fromRow);
  }
  const all = loadLocal().filter((a) => a.status === "published").sort(newest);
  return limit ? all.slice(0, limit) : all;
}

export async function listStaffActivities(): Promise<Activity[]> {
  if (supabase && live()) {
    const { data, error } = await supabase.from("activities").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return ((data ?? []) as Row[]).map(fromRow);
  }
  return loadLocal().sort(newest);
}

export async function getStaffActivity(id: string): Promise<Activity | null> {
  if (supabase && live()) {
    const { data, error } = await supabase.from("activities").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? fromRow(data as Row) : null;
  }
  return loadLocal().find((a) => a.id === id) ?? null;
}

export async function saveActivity(id: string | null, input: ActivityInput, authorId: string | null): Promise<Activity> {
  if (!input.title.trim()) throw new Error("Please enter a title.");
  if (input.linkUrl && !/^https:\/\//i.test(input.linkUrl)) throw new Error("The link must start with https://");
  let coverPath: string | null = input.coverPath ?? null;
  if (input.coverFile) coverPath = await uploadCover(input.coverFile, "activity");

  if (supabase && live()) {
    const payload = {
      title: input.title.trim(), summary: input.summary.trim(), happened_on: input.happenedOn, link_url: input.linkUrl,
      cover_path: coverPath,
      status: input.status, ...(id ? {} : { created_by: authorId }),
    };
    const query = id ? supabase.from("activities").update(payload).eq("id", id) : supabase.from("activities").insert(payload);
    const { data, error } = await query.select("*").single();
    if (error) throw error;
    return fromRow(data as Row);
  }
  const list = loadLocal();
  const isUrl = (p: string | null) => Boolean(p && (p.startsWith("http") || p.startsWith("data:")));
  const fields = {
    title: input.title.trim(), summary: input.summary.trim(), happenedOn: input.happenedOn, linkUrl: input.linkUrl,
    coverPath, coverUrl: isUrl(coverPath) ? coverPath! : "", status: input.status,
  };
  if (id) {
    const next = list.map((a) => (a.id === id ? { ...a, ...fields } : a));
    saveLocal(next);
    return next.find((a) => a.id === id)!;
  }
  const created: Activity = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...fields };
  saveLocal([created, ...list]);
  return created;
}

export async function setActivityStatus(id: string, status: ActivityStatus): Promise<void> {
  if (supabase && live()) {
    const { data, error } = await supabase.from("activities").update({ status }).eq("id", id).select("id");
    if (error) throw error;
    if (!data || data.length === 0) throw new Error("Could not update the activity.");
    return;
  }
  saveLocal(loadLocal().map((a) => (a.id === id ? { ...a, status } : a)));
}

export async function deleteActivity(id: string): Promise<void> {
  if (supabase && live()) {
    const { data: row } = await supabase.from("activities").select("cover_path").eq("id", id).maybeSingle();
    const { data, error } = await supabase.from("activities").delete().eq("id", id).select("id");
    if (error) throw error;
    if (!data || data.length === 0) throw new Error("The activity could not be deleted.");
    await removeCoverFile((row as { cover_path: string | null } | null)?.cover_path ?? null);
    return;
  }
  saveLocal(loadLocal().filter((a) => a.id !== id));
}

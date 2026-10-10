import { coverPublicUrl, uploadCover } from "../news/api";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";
import type { Episode, EpisodeInput, EpisodeStatus } from "./types";

const LOCAL_KEY = "auya_podcast_episodes";
const LIVE_STATUSES: EpisodeStatus[] = ["published", "scheduled"];

type Row = {
  id: string;
  slug: string;
  title: string;
  description: string;
  show_notes: string;
  episode_number: number | null;
  season: number | null;
  guests: string;
  audio_url: string | null;
  embed_url: string | null;
  duration_minutes: number | null;
  cover_path: string | null;
  status: EpisodeStatus;
  published_at: string | null;
  updated_at: string;
};

function fromRow(r: Row): Episode {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    description: r.description,
    showNotes: r.show_notes,
    episodeNumber: r.episode_number,
    season: r.season,
    guests: r.guests,
    audioUrl: r.audio_url,
    embedUrl: r.embed_url,
    durationMinutes: r.duration_minutes,
    coverPath: r.cover_path,
    coverUrl: coverPublicUrl(r.cover_path),
    status: r.status,
    publishedAt: r.published_at,
    updatedAt: r.updated_at,
  };
}

function fail(error: { message: string; code?: string }): never {
  if (error.code === "23505") throw new Error("Another episode already uses that web address or episode number.");
  throw new Error(error.message);
}

const live = (e: Episode, now = Date.now()) =>
  LIVE_STATUSES.includes(e.status) && Boolean(e.publishedAt) && new Date(e.publishedAt!).getTime() <= now;

function demoSeed(): Episode[] {
  const now = new Date().toISOString();
  return [
    {
      id: crypto.randomUUID(), slug: "welcome-to-the-podcast", title: "Welcome to the podcast",
      description: "A demo episode used when no backend is connected.",
      showNotes: "## About this episode\n\nDemo content only.", episodeNumber: 1, season: 1, guests: "Demo Guest, Host",
      audioUrl: null, embedUrl: null, durationMinutes: 20, coverPath: null, coverUrl: "",
      status: "published", publishedAt: now, updatedAt: now,
    },
  ];
}

function loadLocal(): Episode[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) return JSON.parse(raw) as Episode[];
  } catch {
    /* use the seed */
  }
  const seed = demoSeed();
  localStorage.setItem(LOCAL_KEY, JSON.stringify(seed));
  return seed;
}

const saveLocal = (episodes: Episode[]) => localStorage.setItem(LOCAL_KEY, JSON.stringify(episodes));
const byDateDesc = (a: Episode, b: Episode) => (b.publishedAt ?? b.updatedAt).localeCompare(a.publishedAt ?? a.updatedAt);
const useSupabase = Boolean(supabase && isSupabaseConfigured);

export async function listPublishedEpisodes(): Promise<Episode[]> {
  if (supabase && useSupabase) {
    const { data, error } = await supabase
      .from("podcast_episodes")
      .select("*")
      .in("status", LIVE_STATUSES)
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false });
    if (error) fail(error);
    return ((data ?? []) as Row[]).map(fromRow);
  }
  return loadLocal().filter((e) => live(e)).sort(byDateDesc);
}

export async function getPublishedEpisode(slug: string): Promise<Episode | null> {
  if (supabase && useSupabase) {
    const { data, error } = await supabase
      .from("podcast_episodes")
      .select("*")
      .eq("slug", slug)
      .in("status", LIVE_STATUSES)
      .lte("published_at", new Date().toISOString())
      .maybeSingle();
    if (error) fail(error);
    return data ? fromRow(data as Row) : null;
  }
  return loadLocal().find((e) => e.slug === slug && live(e)) ?? null;
}

export async function listStaffEpisodes(): Promise<Episode[]> {
  if (supabase && useSupabase) {
    const { data, error } = await supabase.from("podcast_episodes").select("*").order("updated_at", { ascending: false });
    if (error) fail(error);
    return ((data ?? []) as Row[]).map(fromRow);
  }
  return loadLocal().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getStaffEpisode(id: string): Promise<Episode | null> {
  if (supabase && useSupabase) {
    const { data, error } = await supabase.from("podcast_episodes").select("*").eq("id", id).maybeSingle();
    if (error) fail(error);
    return data ? fromRow(data as Row) : null;
  }
  return loadLocal().find((e) => e.id === id) ?? null;
}

export async function saveEpisode(id: string | null, input: EpisodeInput, authorId: string | null): Promise<Episode> {
  let coverPath: string | null = input.coverUrl ?? null;
  if (input.coverFile) coverPath = await uploadCover(input.coverFile, input.slug);
  if (input.status === "scheduled" && !input.publishedAt) throw new Error("Choose a date and time to schedule this episode.");
  const publishedAt = input.status === "published" ? input.publishedAt ?? new Date().toISOString() : input.publishedAt;

  if (supabase && useSupabase) {
    const payload = {
      slug: input.slug,
      title: input.title,
      description: input.description,
      show_notes: input.showNotes,
      episode_number: input.episodeNumber,
      season: input.season,
      guests: input.guests,
      audio_url: input.audioUrl,
      embed_url: input.embedUrl,
      duration_minutes: input.durationMinutes,
      cover_path: coverPath,
      status: input.status,
      published_at: publishedAt,
      ...(id ? {} : { created_by: authorId }),
    };
    const query = id ? supabase.from("podcast_episodes").update(payload).eq("id", id) : supabase.from("podcast_episodes").insert(payload);
    const { data, error } = await query.select("*").single();
    if (error) fail(error);
    return fromRow(data as Row);
  }

  const episodes = loadLocal();
  const now = new Date().toISOString();
  const isUrl = (p: string | null) => Boolean(p && (p.startsWith("http") || p.startsWith("data:")));
  if (episodes.some((e) => e.slug === input.slug && e.id !== id)) throw new Error("Another episode already uses that web address or episode number.");
  const fields = {
    slug: input.slug, title: input.title, description: input.description, showNotes: input.showNotes,
    episodeNumber: input.episodeNumber, season: input.season, guests: input.guests, audioUrl: input.audioUrl,
    embedUrl: input.embedUrl, durationMinutes: input.durationMinutes, coverPath, coverUrl: isUrl(coverPath) ? coverPath! : "",
    status: input.status, publishedAt, updatedAt: now,
  };
  if (id) {
    const next = episodes.map((e) => (e.id === id ? { ...e, ...fields } : e));
    saveLocal(next);
    return next.find((e) => e.id === id)!;
  }
  const created: Episode = { id: crypto.randomUUID(), ...fields };
  saveLocal([created, ...episodes]);
  return created;
}

export async function setEpisodeStatus(id: string, status: EpisodeStatus): Promise<void> {
  const publishedAt = status === "published" ? new Date().toISOString() : undefined;
  if (supabase && useSupabase) {
    const payload: Record<string, unknown> = { status };
    if (publishedAt) payload.published_at = publishedAt;
    const { error } = await supabase.from("podcast_episodes").update(payload).eq("id", id);
    if (error) fail(error);
    return;
  }
  saveLocal(loadLocal().map((e) => (e.id === id ? { ...e, status, publishedAt: publishedAt ?? e.publishedAt, updatedAt: new Date().toISOString() } : e)));
}

export async function deleteEpisode(id: string): Promise<void> {
  if (supabase && useSupabase) {
    const { error } = await supabase.from("podcast_episodes").delete().eq("id", id);
    if (error) fail(error);
    return;
  }
  saveLocal(loadLocal().filter((e) => e.id !== id));
}

export type EpisodeStatus = "draft" | "scheduled" | "published";

export interface Episode {
  id: string;
  slug: string;
  title: string;
  description: string;
  showNotes: string;
  episodeNumber: number | null;
  season: number | null;
  guests: string;
  audioUrl: string | null;
  embedUrl: string | null;
  durationMinutes: number | null;
  coverPath: string | null;
  coverUrl: string;
  status: EpisodeStatus;
  publishedAt: string | null;
  updatedAt: string;
}

export interface EpisodeInput {
  slug: string;
  title: string;
  description: string;
  showNotes: string;
  episodeNumber: number | null;
  season: number | null;
  guests: string;
  audioUrl: string | null;
  embedUrl: string | null;
  durationMinutes: number | null;
  coverUrl?: string;
  coverFile?: File | null;
  status: EpisodeStatus;
  publishedAt: string | null;
}

export const episodeLabel = (e: Pick<Episode, "season" | "episodeNumber">) =>
  e.episodeNumber ? `${e.season ? `S${e.season} · ` : ""}Episode ${e.episodeNumber}` : "";

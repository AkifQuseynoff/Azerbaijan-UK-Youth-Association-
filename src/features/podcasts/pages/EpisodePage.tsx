import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../../components/ui/PageHeader";
import { formatArticleDate } from "../../../types";
import { MarkdownBody } from "../../news/markdown";
import { getPublishedEpisode } from "../api";
import PlayerEmbed from "../PlayerEmbed";
import { episodeLabel } from "../types";
import type { Episode } from "../types";

export default function EpisodePage() {
  const { slug = "" } = useParams();
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPublishedEpisode(slug)
      .then(setEpisode)
      .catch(() => setEpisode(null))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (episode) document.title = `${episode.title} · Podcast · UK-Azerbaijan Youth Association`;
  }, [episode]);

  if (loading) return <div className="min-h-[60vh] pt-24 text-center text-mute">Loading…</div>;
  if (!episode) {
    return (
      <div className="page-transition flex min-h-[60vh] items-center justify-center px-6 py-24 text-center">
        <div>
          <h1 className="display mb-3 text-4xl">Episode not found</h1>
          <Link to="/podcast" className="btn btn-blue mt-3">All episodes</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition">
      <PageHeader
        eyebrow={[episodeLabel(episode), episode.publishedAt ? formatArticleDate(episode.publishedAt) : ""].filter(Boolean).join(" · ") || "Podcast"}
        title={episode.title}
        width="max-w-4xl"
      />
      <div className="mx-auto max-w-4xl space-y-8 px-5 py-10 sm:px-8">
        <div className="card space-y-6 p-6 sm:p-8">
          {episode.guests && <p className="text-sm text-mute">With <span className="font-semibold text-ink">{episode.guests}</span>{episode.durationMinutes ? ` · ${episode.durationMinutes} min` : ""}</p>}
          <PlayerEmbed embedUrl={episode.embedUrl} audioUrl={episode.audioUrl} title={episode.title} />
          {episode.description && <p className="text-lg leading-relaxed text-mute">{episode.description}</p>}
          {episode.showNotes && <MarkdownBody source={episode.showNotes} />}
        </div>
        <Link to="/podcast" className="text-sm font-semibold text-brand-blue underline underline-offset-4">← All episodes</Link>
      </div>
    </div>
  );
}

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
    if (episode) document.title = `${episode.title} · Podcast · Azerbaijan UK Youth Association`;
  }, [episode]);

  if (loading) return <div className="min-h-screen pt-24 text-center text-gray-500">Loading…</div>;
  if (!episode) {
    return (
      <div className="page-transition min-h-[60vh] flex items-center justify-center px-6 py-24 text-center">
        <div>
          <h1 className="text-3xl text-[#0D1B2A] font-display mb-3">Episode not found</h1>
          <Link to="/podcast" className="px-6 py-3 bg-[#003580] text-white font-semibold rounded-xl inline-block mt-3">All episodes</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition min-h-screen bg-[#F4F6FB]">
      <PageHeader
        eyebrow={[episodeLabel(episode), episode.publishedAt ? formatArticleDate(episode.publishedAt) : ""].filter(Boolean).join(" · ") || "Podcast"}
        title={episode.title}
        width="max-w-4xl"
      />
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
          {episode.guests && <p className="text-sm text-gray-500">With <span className="font-semibold text-[#0D1B2A]">{episode.guests}</span>{episode.durationMinutes ? ` · ${episode.durationMinutes} min` : ""}</p>}
          <PlayerEmbed embedUrl={episode.embedUrl} audioUrl={episode.audioUrl} title={episode.title} />
          {episode.description && <p className="text-gray-700 leading-relaxed text-lg">{episode.description}</p>}
          {episode.showNotes && <MarkdownBody source={episode.showNotes} />}
        </div>
        <Link to="/podcast" className="text-sm text-[#003580] underline">← All episodes</Link>
      </div>
    </div>
  );
}

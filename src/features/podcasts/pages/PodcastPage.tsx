import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../../components/ui/PageHeader";
import { eventsApi } from "../../events/api";
import { formatEventDate, formatEventTime } from "../../events/types";
import type { EventItem } from "../../events/types";
import { formatArticleDate } from "../../../types";
import { listPublishedEpisodes } from "../api";
import { episodeLabel } from "../types";
import type { Episode } from "../types";

export default function PodcastPage() {
  const [episodes, setEpisodes] = useState<Episode[] | null>(null);
  const [live, setLive] = useState<EventItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    listPublishedEpisodes()
      .then(setEpisodes)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Could not load episodes.");
        setEpisodes([]);
      });
    eventsApi
      .listUpcoming()
      .then((events) => setLive(events.filter((e) => e.kind === "podcast_live" && e.status === "published")))
      .catch(() => undefined);
  }, []);

  return (
    <div className="page-transition min-h-screen bg-[#F4F6FB]">
      <PageHeader eyebrow="Listen" title="The Podcast" subtitle="Conversations with and for young Azerbaijanis across the UK." />
      <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
        {live.length > 0 && (
          <section aria-labelledby="live-heading" className="rounded-2xl bg-[#002060] text-white p-7">
            <h2 id="live-heading" className="text-xl font-display mb-4">Join a live recording</h2>
            <ul className="space-y-3">
              {live.map((e) => (
                <li key={e.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <div className="flex-1">
                    <Link to={`/events/${e.slug}`} className="font-semibold underline">{e.title}</Link>
                    <p className="text-blue-200 text-sm">{formatEventDate(e.startsAt)} · {formatEventTime(e.startsAt, e.endsAt)}{e.venue ? ` · ${e.venue}` : ""}</p>
                  </div>
                  <Link to={`/events/${e.slug}`} className="px-4 py-2 rounded-xl bg-[#CC2229] font-semibold text-sm text-center">Reserve a place</Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {error && <p role="alert" className="text-[#CC2229]">{error}</p>}
        {episodes === null ? (
          <p className="text-gray-500">Loading episodes…</p>
        ) : episodes.length === 0 ? (
          <p className="text-gray-500">No episodes yet. Check back soon.</p>
        ) : (
          <div className="grid gap-5">
            {episodes.map((ep) => (
              <article key={ep.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden grid sm:grid-cols-[200px_1fr]">
                <div className="bg-gray-100 aspect-video sm:aspect-auto">
                  {ep.coverUrl ? <img src={ep.coverUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl" aria-hidden="true">🎙️</div>}
                </div>
                <div className="p-6">
                  <p className="text-xs font-semibold text-[#00997A] uppercase tracking-wider mb-1">
                    {episodeLabel(ep)}
                    {ep.publishedAt ? `${episodeLabel(ep) ? " · " : ""}${formatArticleDate(ep.publishedAt)}` : ""}
                    {ep.durationMinutes ? ` · ${ep.durationMinutes} min` : ""}
                  </p>
                  <h2 className="text-xl font-bold text-[#0D1B2A] font-display mb-2">
                    <Link to={`/podcast/${ep.slug}`} className="hover:text-[#003580]">{ep.title}</Link>
                  </h2>
                  {ep.guests && <p className="text-sm text-gray-500 mb-2">With {ep.guests}</p>}
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{ep.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

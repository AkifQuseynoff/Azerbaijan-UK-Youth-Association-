import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LogoMark } from "../../../components/brand/Logo";
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
    <div className="page-transition">
      <PageHeader eyebrow="Listen" title="The Podcast" subtitle="Conversations with and for young Azerbaijanis across the UK." />
      <div className="mx-auto max-w-5xl space-y-10 px-5 py-10 sm:px-8">
        {live.length > 0 && (
          <section aria-labelledby="live-heading" className="rounded-3xl bg-gradient-to-b from-ink to-[#14295a] p-6 text-[#eaf0ff] sm:p-8">
            <h2 id="live-heading" className="display mb-4 text-2xl text-white">Join a live recording</h2>
            <ul className="space-y-4">
              {live.map((e) => (
                <li key={e.id} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                  <div className="flex-1">
                    <Link to={`/events/${e.slug}`} className="font-semibold text-white underline underline-offset-4">{e.title}</Link>
                    <p className="text-sm text-[#c4d2f0]">{formatEventDate(e.startsAt)} · {formatEventTime(e.startsAt, e.endsAt)}{e.venue ? ` · ${e.venue}` : ""}</p>
                  </div>
                  <Link to={`/events/${e.slug}`} className="btn btn-light btn-sm">Reserve a place</Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {error && <p role="alert" className="text-brand-red-dark">{error}</p>}
        {episodes === null ? (
          <p className="text-mute">Loading episodes…</p>
        ) : episodes.length === 0 ? (
          <div className="card px-6 py-12 text-center">
            <p className="font-display text-2xl tracking-tight">No episodes yet</p>
            <p className="mt-1 text-mute">The first conversations are on their way.</p>
          </div>
        ) : (
          <div className="grid gap-5">
            {episodes.map((ep) => (
              <article key={ep.id} className="card press group grid overflow-hidden sm:grid-cols-[220px_1fr]">
                <Link to={`/podcast/${ep.slug}`} tabIndex={-1} aria-hidden="true" className="block aspect-video bg-gradient-to-br from-mist to-[#f9e8df] sm:aspect-auto">
                  {ep.coverUrl ? (
                    <img src={ep.coverUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <span className="grid h-full w-full place-items-center"><LogoMark className="h-16 w-auto opacity-90" decorative /></span>
                  )}
                </Link>
                <div className="p-6">
                  <p className="eyebrow mb-1 !text-brand-green">
                    {episodeLabel(ep)}
                    {ep.publishedAt ? `${episodeLabel(ep) ? " · " : ""}${formatArticleDate(ep.publishedAt)}` : ""}
                    {ep.durationMinutes ? ` · ${ep.durationMinutes} min` : ""}
                  </p>
                  <h2 className="mb-2 font-display text-[1.5rem] font-medium leading-tight tracking-tight">
                    <Link to={`/podcast/${ep.slug}`} className="transition-colors hover:text-brand-blue">{ep.title}</Link>
                  </h2>
                  {ep.guests && <p className="mb-2 text-sm font-semibold text-mute">With {ep.guests}</p>}
                  <p className="line-clamp-3 text-[0.96rem] text-mute">{ep.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

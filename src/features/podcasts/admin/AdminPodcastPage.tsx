import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import PageHeader from "../../../components/ui/PageHeader";
import { formatArticleDate } from "../../../types";
import { deleteEpisode, listStaffEpisodes, setEpisodeStatus } from "../api";
import { episodeLabel } from "../types";
import type { Episode, EpisodeStatus } from "../types";

const FILTERS = ["all", "draft", "scheduled", "published"] as const;

export default function AdminPodcastPage() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<Episode | null>(null);

  const refresh = async () => setEpisodes(await listStaffEpisodes());
  useEffect(() => {
    refresh().catch((err) => setError(err instanceof Error ? err.message : "Could not load episodes."));
  }, []);

  const run = async (action: () => Promise<void>) => {
    setError("");
    try {
      await action();
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const visible = filter === "all" ? episodes : episodes.filter((e) => e.status === filter);
  const statusButton = (ep: Episode, status: EpisodeStatus, label: string, cls: string) => (
    <button type="button" className={`btn btn-sm ${cls}`} onClick={() => void run(() => setEpisodeStatus(ep.id, status))}>{label}</button>
  );

  return (
    <div className="page-transition">
      <PageHeader
        eyebrow="Staff only"
        title="Podcast"
        width="max-w-6xl"
        action={<Link to="/admin/podcast/new" className="btn btn-primary">New episode</Link>}
      />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map((f) => (
            <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${filter === f ? "bg-ink text-white" : "bg-mist text-ink hover:bg-line"}`}>{f}</button>
          ))}
        </div>
        {error && <p role="alert" className="text-brand-red mb-4">{error}</p>}
        <div className="card overflow-hidden">
          {visible.map((ep) => (
            <div key={ep.id} className="flex flex-col md:flex-row md:items-center gap-3 px-6 py-4 border-b border-line last:border-0">
              <div className="flex-1">
                <p className="font-semibold text-ink">{ep.title}</p>
                <p className="text-xs text-mute mt-1">{[ep.status, episodeLabel(ep), ep.publishedAt ? formatArticleDate(ep.publishedAt) : ""].filter(Boolean).join(" · ")}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to={`/admin/podcast/${ep.id}`} className="btn btn-outline btn-sm">Edit</Link>
                {ep.status !== "published" ? statusButton(ep, "published", "Publish", "btn-green") : statusButton(ep, "draft", "Unpublish", "btn-outline")}
                <button type="button" className="btn btn-danger btn-sm" onClick={() => setDeleting(ep)}>Delete</button>
              </div>
            </div>
          ))}
          {visible.length === 0 && <p className="p-8 text-mute text-center">No episodes in this view.</p>}
        </div>
      </div>
      {deleting && (
        <ConfirmDialog
          danger
          title={`Delete "${deleting.title}"?`}
          message={deleting.status === "published" ? "This episode is live on the site. Deleting it permanently removes it and its cover picture, and its web address stops working. To hide it but keep it, use Unpublish instead. This cannot be undone." : "This permanently removes the episode and its cover picture. This cannot be undone."}
          confirmLabel="Delete episode"
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            const target = deleting;
            setDeleting(null);
            void run(() => deleteEpisode(target.id));
          }}
        />
      )}
    </div>
  );
}

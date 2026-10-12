import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Field, TextAreaField } from "../../../components/ui/Field";
import PageHeader from "../../../components/ui/PageHeader";
import { slugify, toLocalInputValue } from "../../../types";
import { useAuth } from "../../auth/AuthContext";
import { getStaffEpisode, saveEpisode } from "../api";
import { toEmbedUrl } from "../embed";
import type { EpisodeStatus } from "../types";

const empty = {
  title: "", slug: "", description: "", showNotes: "", episodeNumber: "", season: "1", guests: "",
  audioUrl: "", embedLink: "", durationMinutes: "", coverUrl: "", publishedAt: "",
};

const toInt = (v: string): number | null => (v.trim() && /^\d+$/.test(v.trim()) ? Number(v) : null);

export default function AdminPodcastEditorPage() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [form, setForm] = useState(empty);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (isNew) return;
    getStaffEpisode(id)
      .then((ep) => {
        if (!ep) return setError("Episode not found.");
        setForm({
          title: ep.title, slug: ep.slug, description: ep.description, showNotes: ep.showNotes,
          episodeNumber: ep.episodeNumber?.toString() ?? "", season: ep.season?.toString() ?? "",
          guests: ep.guests, audioUrl: ep.audioUrl ?? "", embedLink: ep.embedUrl ?? "",
          durationMinutes: ep.durationMinutes?.toString() ?? "", coverUrl: ep.coverUrl,
          publishedAt: toLocalInputValue(ep.publishedAt),
        });
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load the episode."));
  }, [id, isNew]);

  const set = (key: keyof typeof empty, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const persist = async (status: EpisodeStatus) => {
    setError("");
    setNotice("");
    if (!form.title.trim()) return setError("Please enter a title.");
    let embedUrl: string | null = null;
    if (form.embedLink.trim()) {
      embedUrl = toEmbedUrl(form.embedLink);
      if (!embedUrl) return setError("That player link is not supported. Use a Spotify, YouTube, Apple Podcasts or SoundCloud link.");
    }
    if (form.audioUrl.trim() && !form.audioUrl.trim().startsWith("https://")) return setError("The audio file link must start with https://");
    for (const [label, v] of [["Episode number", form.episodeNumber], ["Season", form.season], ["Duration", form.durationMinutes]] as const) {
      if (v.trim() && toInt(v) === null) return setError(`${label} must be a whole number.`);
    }
    setPending(true);
    try {
      const publishedAt = form.publishedAt ? new Date(form.publishedAt).toISOString() : null;
      const saved = await saveEpisode(
        isNew ? null : id,
        {
          slug: form.slug || slugify(form.title), title: form.title.trim(), description: form.description, showNotes: form.showNotes,
          episodeNumber: toInt(form.episodeNumber), season: toInt(form.season), guests: form.guests.trim(),
          audioUrl: form.audioUrl.trim() || null, embedUrl, durationMinutes: toInt(form.durationMinutes),
          coverUrl: form.coverUrl, coverFile, status, publishedAt,
        },
        profile?.id ?? null,
      );
      setNotice(status === "published" ? "Published." : status === "scheduled" ? "Scheduled." : "Saved.");
      if (isNew) navigate(`/admin/podcast/${saved.id}`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the episode.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="page-transition">
      <PageHeader eyebrow="Staff only" title={isNew ? "New episode" : "Edit episode"} width="max-w-4xl" action={<Link to="/admin/podcast" className="text-sm font-semibold text-brand-blue underline underline-offset-4">Back to podcast</Link>} />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="card p-6 sm:p-8 space-y-5">
          <div><Field label="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value, slug: isNew || !f.slug ? slugify(e.target.value) : f.slug }))} /></div>
          <div><Field label="Web address (slug)" value={form.slug} onChange={(e) => set("slug", slugify(e.target.value))} /></div>
          <div className="grid sm:grid-cols-3 gap-5">
            <div><Field label="Season" inputMode="numeric" value={form.season} onChange={(e) => set("season", e.target.value)} /></div>
            <div><Field label="Episode number" inputMode="numeric" value={form.episodeNumber} onChange={(e) => set("episodeNumber", e.target.value)} /></div>
            <div><Field label="Length (minutes)" inputMode="numeric" value={form.durationMinutes} onChange={(e) => set("durationMinutes", e.target.value)} /></div>
          </div>
          <div><Field label="Guests" value={form.guests} onChange={(e) => set("guests", e.target.value)} hint="For example: Aysel Mammadova, founder of Example Ltd" /></div>
          <div><TextAreaField label="Short description" rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} /></div>
          <div><TextAreaField label="Show notes (Markdown)" rows={10} value={form.showNotes} onChange={(e) => set("showNotes", e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm resize-y font-mono" /></div>
          <div><Field label="Player link" value={form.embedLink} onChange={(e) => set("embedLink", e.target.value)} hint="Paste the normal episode link from Spotify, YouTube, Apple Podcasts or SoundCloud. We turn it into a player." /></div>
          <div><Field label="Direct audio file link (optional)" type="url" value={form.audioUrl} onChange={(e) => set("audioUrl", e.target.value)} hint="An https:// link to an .mp3 you host elsewhere." /></div>
          <div>
            <label htmlFor="ep-cover" className="mb-1.5 block text-sm font-semibold text-ink">Cover image</label>
            <input id="ep-cover" type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} className="text-sm" />
            {form.coverUrl && !coverFile && <img src={form.coverUrl} alt="" className="mt-3 h-28 rounded-xl object-cover" />}
          </div>
          <div><Field label="Publish at (for scheduling)" type="datetime-local" value={form.publishedAt} onChange={(e) => set("publishedAt", e.target.value)} /></div>

          {error && <p role="alert" className="text-brand-red text-sm">{error}</p>}
          {notice && <p className="text-brand-green text-sm">{notice}</p>}
          <div className="flex flex-wrap gap-3">
            <button type="button" disabled={pending} onClick={() => void persist("draft")} className="btn btn-outline">Save draft</button>
            <button type="button" disabled={pending || !form.publishedAt} onClick={() => void persist("scheduled")} className="btn bg-amber-600 text-white hover:bg-amber-700">Schedule</button>
            <button type="button" disabled={pending} onClick={() => void persist("published")} className="btn btn-primary">Publish</button>
          </div>
        </div>
      </div>
    </div>
  );
}

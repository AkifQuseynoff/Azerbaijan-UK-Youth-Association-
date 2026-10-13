import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CoverImage from "../../../components/ui/CoverImage";
import { Field, TextAreaField } from "../../../components/ui/Field";
import PageHeader from "../../../components/ui/PageHeader";
import { useAuth } from "../../auth/AuthContext";
import { prepareImage } from "../../news/media";
import { getStaffActivity, saveActivity } from "../api";
import type { ActivityStatus } from "../api";

const empty = { title: "", summary: "", happenedOn: "", linkUrl: "", coverPath: null as string | null, coverUrl: "" };

export default function AdminActivityEditorPage() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [form, setForm] = useState(empty);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (isNew) return;
    getStaffActivity(id)
      .then((a) => {
        if (!a) return setError("Activity not found.");
        setForm({ title: a.title, summary: a.summary, happenedOn: a.happenedOn ?? "", linkUrl: a.linkUrl ?? "", coverPath: a.coverPath, coverUrl: a.coverUrl });
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load the activity."));
  }, [id, isNew]);

  useEffect(() => {
    if (!coverFile) return setPreview("");
    const url = URL.createObjectURL(coverFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  const persist = async (status: ActivityStatus) => {
    setError("");
    setNotice("");
    setPending(true);
    try {
      const ready = coverFile ? await prepareImage(coverFile) : null;
      const saved = await saveActivity(
        isNew ? null : id,
        { title: form.title, summary: form.summary, happenedOn: form.happenedOn || null, linkUrl: form.linkUrl.trim() || null, coverPath: form.coverPath, coverFile: ready, status },
        profile?.id ?? null,
      );
      setCoverFile(null);
      setForm((f) => ({ ...f, coverPath: saved.coverPath, coverUrl: saved.coverUrl }));
      setNotice(status === "published" ? "Published." : "Saved as a draft.");
      if (isNew) navigate(`/admin/activities/${saved.id}`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the activity.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="page-transition">
      <PageHeader eyebrow="Staff only" title={isNew ? "New activity" : "Edit activity"} width="max-w-4xl" action={<Link to="/admin/activities" className="text-sm font-semibold text-brand-blue underline underline-offset-4">Back to activities</Link>} />
      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
        <div className="card space-y-5 p-6 sm:p-8">
          <div><Field label="Title" value={form.title} maxLength={120} onChange={(e) => setForm({ ...form, title: e.target.value })} hint="For example: Annual Cultural Festival at the South Bank" /></div>
          <div><TextAreaField label="Short description" rows={4} maxLength={600} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} hint="A few sentences on what happened. Up to 600 characters." /></div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div><Field label="Date (optional)" type="date" value={form.happenedOn} onChange={(e) => setForm({ ...form, happenedOn: e.target.value })} /></div>
            <div><Field label="Link (optional)" type="url" value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} hint="Starts with https://. The card then opens this page." /></div>
          </div>
          <div>
            <label htmlFor="activity-cover" className="mb-1.5 block text-sm font-semibold">Picture (optional)</label>
            <input id="activity-cover" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} className="text-sm" />
            <p className="mt-1 text-xs text-mute">JPG, PNG or WebP. Large photos are shrunk automatically.</p>
            {(preview || form.coverUrl) && (
              <div className="mt-3 aspect-[16/10] w-full max-w-xs overflow-hidden rounded-2xl bg-mist">
                <CoverImage src={preview || form.coverUrl} />
              </div>
            )}
          </div>
          {error && <p role="alert" className="text-sm text-brand-red-dark">{error}</p>}
          {notice && <p role="status" className="text-sm font-semibold text-[#2c6638]">{notice}</p>}
          <div className="flex flex-wrap gap-3">
            <button type="button" disabled={pending} onClick={() => void persist("draft")} className="btn btn-outline">Save draft</button>
            <button type="button" disabled={pending} onClick={() => void persist("published")} className="btn btn-primary">Publish</button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Field, TextAreaField } from "../../../components/ui/Field";
import PageHeader from "../../../components/ui/PageHeader";
import { CITIES } from "../../../constants";
import { slugify } from "../../../types";
import { useAuth } from "../../auth/AuthContext";
import { prepareImage } from "../../news/media";
import { getStaffSociety, saveSociety } from "../api";
import type { SocietyStatus } from "../api";
import SocietyLogo from "../SocietyLogo";

const empty = { name: "", slug: "", university: "", city: "", description: "", websiteUrl: "", instagramUrl: "", facebookUrl: "", contactEmail: "", logoPath: null as string | null, logoUrl: "" };

export default function AdminSocietyEditorPage() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [form, setForm] = useState(empty);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (isNew) return;
    getStaffSociety(id)
      .then((s) => {
        if (!s) return setError("Society not found.");
        setForm({ name: s.name, slug: s.slug, university: s.university, city: s.city, description: s.description, websiteUrl: s.websiteUrl, instagramUrl: s.instagramUrl, facebookUrl: s.facebookUrl, contactEmail: s.contactEmail, logoPath: s.logoPath, logoUrl: s.logoUrl });
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load the society."));
  }, [id, isNew]);

  useEffect(() => {
    if (!logoFile) return setPreview("");
    const url = URL.createObjectURL(logoFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [logoFile]);

  const set = (key: keyof typeof empty, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const persist = async (status: SocietyStatus) => {
    setError("");
    setNotice("");
    setPending(true);
    try {
      const ready = logoFile ? await prepareImage(logoFile) : null;
      const saved = await saveSociety(
        isNew ? null : id,
        { ...form, slug: form.slug || slugify(`${form.name} ${form.university}`), logoFile: ready, status },
        profile?.id ?? null,
      );
      setLogoFile(null);
      setForm((f) => ({ ...f, slug: saved.slug, logoPath: saved.logoPath, logoUrl: saved.logoUrl }));
      setNotice(status === "published" ? "Published." : "Saved as a draft.");
      if (isNew) navigate(`/admin/societies/${saved.id}`, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the society.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="page-transition">
      <PageHeader eyebrow="Staff only" title={isNew ? "Add a society" : "Edit society"} width="max-w-4xl" action={<Link to="/admin/societies" className="text-sm font-semibold text-brand-blue underline underline-offset-4">Back to societies</Link>} />
      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
        <div className="card space-y-5 p-6 sm:p-8">
          <div><Field label="Society name" value={form.name} maxLength={120} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: isNew || !f.slug ? slugify(`${e.target.value} ${f.university}`) : f.slug }))} hint="For example: Edinburgh Azerbaijani Society" /></div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div><Field label="University" value={form.university} maxLength={160} onChange={(e) => setForm((f) => ({ ...f, university: e.target.value }))} /></div>
            <div>
              <Field label="City" list="society-cities" value={form.city} maxLength={80} onChange={(e) => set("city", e.target.value)} />
              <datalist id="society-cities">{CITIES.filter((c) => c !== "Other").map((c) => <option key={c} value={c} />)}</datalist>
            </div>
          </div>
          <div><Field label="Web address (slug)" value={form.slug} onChange={(e) => set("slug", slugify(e.target.value))} hint="Part of the page's address. Filled in from the name; leave it as it is unless it clashes with another society." /></div>
          <div><TextAreaField label="About the society" rows={8} maxLength={2000} value={form.description} onChange={(e) => set("description", e.target.value)} hint="What the society does, who can join and how. Leave a blank line between paragraphs." /></div>
          <div>
            <label htmlFor="society-logo" className="mb-1.5 block text-sm font-semibold">Logo (optional)</label>
            <input id="society-logo" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)} className="text-sm" />
            <p className="mt-1 text-xs text-mute">JPG, PNG or WebP. Without a logo the society's initials are shown.</p>
            <div className="mt-3"><SocietyLogo society={{ name: form.name || "Society", logoUrl: preview || form.logoUrl }} size="lg" /></div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div><Field label="Website" type="url" value={form.websiteUrl} onChange={(e) => set("websiteUrl", e.target.value)} hint="Starts with https://" /></div>
            <div><Field label="Contact email" type="email" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} hint="Shown publicly. Use a society address, not a personal one, if possible." /></div>
            <div><Field label="Instagram" type="url" value={form.instagramUrl} onChange={(e) => set("instagramUrl", e.target.value)} /></div>
            <div><Field label="Facebook" type="url" value={form.facebookUrl} onChange={(e) => set("facebookUrl", e.target.value)} /></div>
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

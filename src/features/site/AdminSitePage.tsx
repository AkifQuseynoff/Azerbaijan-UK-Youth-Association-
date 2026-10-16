import { useEffect, useState } from "react";
import { Field, TextAreaField } from "../../components/ui/Field";
import PageHeader from "../../components/ui/PageHeader";
import { DEFAULT_ABOUT } from "../../data/pillars";
import { EMPTY_SETTINGS, getSiteSettings, saveSiteSettings } from "./api";
import type { SiteSettings } from "./api";
import { useSite } from "./SiteContext";

/** Admins write the About text and contact details here; the public pages pick them up straight away. */
export default function AdminSitePage() {
  const { reload } = useSite();
  const [form, setForm] = useState<SiteSettings>(EMPTY_SETTINGS);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    getSiteSettings()
      .then(setForm)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load the details."))
      .finally(() => setLoaded(true));
  }, []);

  const set = (key: keyof SiteSettings, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setPending(true);
    try {
      await saveSiteSettings(form);
      await reload();
      setNotice("Saved. The site now shows these details.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="page-transition">
      <PageHeader eyebrow="Admins only" title="Site details" subtitle="The About text, contact details and social links shown on the public site. Anything left empty is simply not shown." width="max-w-4xl" />
      <form onSubmit={(e) => void save(e)} className="mx-auto max-w-4xl space-y-8 px-5 py-10 sm:px-8">
        <section className="card space-y-5 p-6 sm:p-8" aria-labelledby="site-about">
          <h2 id="site-about" className="display text-2xl">About the association</h2>
          <TextAreaField
            label="About text"
            rows={8}
            maxLength={3000}
            value={form.about}
            onChange={(e) => set("about", e.target.value)}
            placeholder={DEFAULT_ABOUT}
            hint="Leave a blank line between paragraphs. The first paragraph also appears on the home page. If empty, a short default text is shown."
          />
        </section>

        <section className="card space-y-5 p-6 sm:p-8" aria-labelledby="site-contact">
          <h2 id="site-contact" className="display text-2xl">Contact details</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div><Field label="Email" type="email" value={form.contactEmail} maxLength={200} onChange={(e) => set("contactEmail", e.target.value)} /></div>
            <div><Field label="Phone" type="tel" value={form.contactPhone} maxLength={60} onChange={(e) => set("contactPhone", e.target.value)} /></div>
          </div>
          <TextAreaField label="Address" rows={3} maxLength={300} value={form.contactAddress} onChange={(e) => set("contactAddress", e.target.value)} />
          <Field label="Opening hours or when to expect a reply" value={form.contactHours} maxLength={200} onChange={(e) => set("contactHours", e.target.value)} />
        </section>

        <section className="card space-y-5 p-6 sm:p-8" aria-labelledby="site-social">
          <h2 id="site-social" className="display text-2xl">Social links</h2>
          <div><Field label="Instagram" type="url" value={form.instagramUrl} maxLength={300} onChange={(e) => set("instagramUrl", e.target.value)} hint="Starts with https://" /></div>
          <div><Field label="Facebook" type="url" value={form.facebookUrl} maxLength={300} onChange={(e) => set("facebookUrl", e.target.value)} /></div>
          <div><Field label="LinkedIn" type="url" value={form.linkedinUrl} maxLength={300} onChange={(e) => set("linkedinUrl", e.target.value)} /></div>
        </section>

        {error && <p role="alert" className="text-sm text-brand-red-dark">{error}</p>}
        {notice && <p role="status" className="text-sm font-semibold text-[#2c6638]">{notice}</p>}
        <button type="submit" disabled={pending || !loaded} className="btn btn-blue btn-lg">{pending ? "Saving…" : "Save details"}</button>
      </form>
    </div>
  );
}

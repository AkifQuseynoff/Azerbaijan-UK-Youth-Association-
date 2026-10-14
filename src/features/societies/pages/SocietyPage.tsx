import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../../components/ui/PageHeader";
import { getPublishedSociety } from "../api";
import type { Society } from "../api";
import SocietyLogo from "../SocietyLogo";

export default function SocietyPage() {
  const { slug = "" } = useParams();
  const [society, setSociety] = useState<Society | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPublishedSociety(slug)
      .then(setSociety)
      .catch(() => setSociety(null))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (society) document.title = `${society.name} · Azerbaijan Societies of Universities`;
  }, [society]);

  if (loading) return <div className="min-h-[60vh] pt-24 text-center text-mute">Loading…</div>;
  if (!society) {
    return (
      <div className="page-transition flex min-h-[60vh] items-center justify-center px-6 py-24 text-center">
        <div>
          <h1 className="display mb-3 text-4xl">Society not found</h1>
          <p className="mb-4 text-mute">It may have been removed or is not published yet.</p>
          <Link to="/societies" className="btn btn-blue">All societies</Link>
        </div>
      </div>
    );
  }

  const links = [
    { label: "Website", href: society.websiteUrl },
    { label: "Instagram", href: society.instagramUrl },
    { label: "Facebook", href: society.facebookUrl },
  ].filter((l) => l.href);
  const paragraphs = society.description.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <div className="page-transition">
      <PageHeader eyebrow={[society.university, society.city].filter(Boolean).join(" · ")} title={society.name} width="max-w-4xl" />
      <div className="mx-auto max-w-4xl space-y-6 px-5 py-10 sm:px-8">
        <div className="card flex flex-col gap-6 p-6 sm:flex-row sm:p-8">
          <SocietyLogo society={society} size="lg" />
          <div className="min-w-0 flex-1 space-y-4">
            {paragraphs.length > 0 ? paragraphs.map((p, i) => <p key={i} className="text-lg leading-relaxed text-mute">{p}</p>) : <p className="text-mute">More information is coming soon.</p>}
            {(links.length > 0 || society.contactEmail) && (
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {links.map((l) => (
                  <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">{l.label}</a>
                ))}
                {society.contactEmail && <a href={`mailto:${society.contactEmail}`} className="btn btn-blue btn-sm">Email the society</a>}
              </div>
            )}
          </div>
        </div>
        <Link to="/societies" className="text-sm font-semibold text-brand-blue underline underline-offset-4">← All societies</Link>
      </div>
    </div>
  );
}

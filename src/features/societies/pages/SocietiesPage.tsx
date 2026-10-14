import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../../components/ui/PageHeader";
import Reveal from "../../../components/ui/Reveal";
import { listPublishedSocieties } from "../api";
import type { Society } from "../api";
import SocietyTile from "../SocietyTile";

export default function SocietiesPage() {
  const [societies, setSocieties] = useState<Society[] | null>(null);
  const [error, setError] = useState("");
  const [city, setCity] = useState("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    listPublishedSocieties()
      .then(setSocieties)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Could not load the societies.");
        setSocieties([]);
      });
  }, []);

  const cities = useMemo(() => ["All", ...Array.from(new Set((societies ?? []).map((s) => s.city).filter(Boolean))).sort()], [societies]);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (societies ?? []).filter((s) => (city === "All" || s.city === city) && (!q || `${s.name} ${s.university} ${s.city}`.toLowerCase().includes(q)));
  }, [societies, city, query]);

  return (
    <div className="page-transition">
      <PageHeader eyebrow="Student life" title="Azerbaijan Societies of Universities" subtitle="Azerbaijani student societies at universities across the UK, and how to find them." />
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        {error && <p role="alert" className="mb-6 rounded-2xl bg-brand-red/10 px-4 py-3 text-sm text-brand-red-dark">{error}</p>}
        {societies === null ? (
          <p className="text-mute">Loading…</p>
        ) : societies.length === 0 ? (
          <div className="card px-6 py-12 text-center">
            <p className="font-display text-2xl tracking-tight">Societies are being added</p>
            <p className="mt-1 text-mute">Check back soon. Run a society at your university and want it listed? Get in touch through the Help page.</p>
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex flex-1 flex-wrap gap-2" role="group" aria-label="Filter by city">
                {cities.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={city === c}
                    onClick={() => setCity(c)}
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition-[background-color,color,transform] duration-150 active:scale-95 ${city === c ? "bg-ink text-white" : "bg-mist text-ink hover:bg-line"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search societies"
                aria-label="Search societies"
                className="w-full rounded-full border border-line bg-white px-5 py-2.5 text-base md:w-72"
              />
            </div>
            {visible.length === 0 ? (
              <p className="py-12 text-center text-mute">No society matches this search.</p>
            ) : (
              <Reveal className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
                {visible.map((s) => (
                  <SocietyTile key={s.id} society={s} />
                ))}
              </Reveal>
            )}
          </>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import PageHeader from "../../../components/ui/PageHeader";
import { deleteSociety, listStaffSocieties, setSocietyStatus } from "../api";
import type { Society } from "../api";

const FILTERS = ["all", "published", "draft"] as const;
const LABELS = { all: "All", published: "Published", draft: "Drafts" } as const;

export default function AdminSocietiesPage() {
  const [items, setItems] = useState<Society[]>([]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<Society | null>(null);

  const refresh = async () => setItems(await listStaffSocieties());

  useEffect(() => {
    refresh().catch((err) => setError(err instanceof Error ? err.message : "Could not load the societies."));
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

  const visible = filter === "all" ? items : items.filter((s) => s.status === filter);

  return (
    <div className="page-transition">
      <PageHeader
        eyebrow="Staff only"
        title="University societies"
        subtitle="The Azerbaijan Societies of Universities directory. Published entries appear on the Societies page."
        width="max-w-6xl"
        action={<Link to="/admin/societies/new" className="btn btn-primary">Add a society</Link>}
      />
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter">
          {FILTERS.map((f) => (
            <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)} className={`rounded-full px-4 py-2 text-sm font-semibold ${filter === f ? "bg-ink text-white" : "bg-mist text-ink hover:bg-line"}`}>
              {LABELS[f]} <span className={filter === f ? "opacity-70" : "text-mute"}>{f === "all" ? items.length : items.filter((s) => s.status === f).length}</span>
            </button>
          ))}
        </div>
        {error && <p role="alert" className="mb-4 text-brand-red-dark">{error}</p>}
        <div className="card overflow-hidden">
          {visible.map((s) => (
            <div key={s.id} className="flex flex-col gap-3 border-b border-line px-6 py-4 last:border-0 md:flex-row md:items-center">
              <div className="flex-1">
                <p className="font-semibold">{s.name}</p>
                <p className="mt-1 text-xs text-mute">{s.status} · {s.university}{s.city ? ` · ${s.city}` : ""}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to={`/admin/societies/${s.id}`} className="btn btn-outline btn-sm">Edit</Link>
                {s.status === "draft" ? (
                  <button type="button" className="btn btn-green btn-sm" onClick={() => void run(() => setSocietyStatus(s.id, "published"))}>Publish</button>
                ) : (
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => void run(() => setSocietyStatus(s.id, "draft"))}>Unpublish</button>
                )}
                <button type="button" className="btn btn-danger btn-sm" onClick={() => setDeleting(s)}>Delete</button>
              </div>
            </div>
          ))}
          {visible.length === 0 && <p className="p-8 text-center text-mute">{items.length === 0 ? "No societies yet. Add the first one." : "No societies in this view."}</p>}
        </div>
      </div>
      {deleting && (
        <ConfirmDialog
          danger
          title={`Delete "${deleting.name}"?`}
          message="This permanently removes the society and its logo. To hide it but keep it, use Unpublish instead. This cannot be undone."
          confirmLabel="Delete society"
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            const target = deleting;
            setDeleting(null);
            void run(() => deleteSociety(target.id));
          }}
        />
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../../components/ui/PageHeader";
import { listStaffArticles, setArticleStatus } from "../api";
import type { Article } from "../../../types";
import { formatArticleDate } from "../../../types";

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filter, setFilter] = useState<"all" | Article["status"]>("all");
  const [error, setError] = useState("");

  const refresh = async () => {
    setArticles(await listStaffArticles());
  };

  useEffect(() => {
    void refresh().catch((err) => setError(err instanceof Error ? err.message : "Could not load articles."));
  }, []);

  const visible = filter === "all" ? articles : articles.filter((a) => a.status === filter);

  return (
    <div className="page-transition">
      <PageHeader
        eyebrow="Staff only"
        title="Newsroom"
        width="max-w-6xl"
        action={<Link to="/admin/news/new" className="btn btn-primary">New article</Link>}
      />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-wrap gap-2 mb-6">
          {(["all", "draft", "scheduled", "published"] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${
                filter === status ? "bg-ink text-white" : "bg-mist text-ink hover:bg-line"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        {error && <p className="text-brand-red mb-4">{error}</p>}
        <div className="card overflow-hidden">
          {visible.map((article) => (
            <div key={article.id} className="flex flex-col md:flex-row md:items-center gap-3 px-6 py-4 border-b border-line last:border-0">
              <div className="flex-1">
                <p className="font-semibold text-ink">{article.title}</p>
                <p className="text-xs text-mute mt-1">
                  {article.status} · {article.category} · {formatArticleDate(article.updatedAt)}
                  {article.featured ? " · Featured" : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to={`/admin/news/${article.id}`} className="btn btn-outline btn-sm">
                  Edit
                </Link>
                {article.status !== "published" ? (
                  <button
                    type="button"
                    className="btn btn-green btn-sm"
                    onClick={() => void setArticleStatus(article.id, "published").then(refresh)}
                  >
                    Publish
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => void setArticleStatus(article.id, "draft").then(refresh)}
                  >
                    Unpublish
                  </button>
                )}
              </div>
            </div>
          ))}
          {visible.length === 0 && <p className="p-8 text-mute text-center">No articles in this view.</p>}
        </div>
      </div>
    </div>
  );
}

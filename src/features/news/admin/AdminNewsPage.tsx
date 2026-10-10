import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FlagDivider from "../../../components/ui/FlagDivider";
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
    <div className="page-transition min-h-screen bg-[#F4F6FB]">
      <div className="bg-[#002060] py-16 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-blue-200 text-sm mb-2">Staff only</p>
            <h1 className="text-5xl text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>Newsroom</h1>
          </div>
          <Link to="/admin/news/new" className="px-5 py-3 bg-[#CC2229] text-white font-semibold rounded-xl text-center">
            New article
          </Link>
        </div>
      </div>
      <FlagDivider />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-wrap gap-2 mb-6">
          {(["all", "draft", "scheduled", "published"] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${
                filter === status ? "bg-[#003580] text-white" : "bg-white border border-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        {error && <p className="text-[#CC2229] mb-4">{error}</p>}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {visible.map((article) => (
            <div key={article.id} className="flex flex-col md:flex-row md:items-center gap-3 px-6 py-4 border-b border-gray-100 last:border-0">
              <div className="flex-1">
                <p className="font-semibold text-[#0D1B2A]">{article.title}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {article.status} · {article.category} · {formatArticleDate(article.updatedAt)}
                  {article.featured ? " · Featured" : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link to={`/admin/news/${article.id}`} className="px-3 py-2 text-sm rounded-lg bg-[#F4F6FB] font-medium">
                  Edit
                </Link>
                {article.status !== "published" ? (
                  <button
                    type="button"
                    className="px-3 py-2 text-sm rounded-lg bg-[#00997A] text-white"
                    onClick={() => void setArticleStatus(article.id, "published").then(refresh)}
                  >
                    Publish
                  </button>
                ) : (
                  <button
                    type="button"
                    className="px-3 py-2 text-sm rounded-lg border border-gray-200"
                    onClick={() => void setArticleStatus(article.id, "draft").then(refresh)}
                  >
                    Unpublish
                  </button>
                )}
              </div>
            </div>
          ))}
          {visible.length === 0 && <p className="p-8 text-gray-400 text-center">No articles in this view.</p>}
        </div>
      </div>
    </div>
  );
}

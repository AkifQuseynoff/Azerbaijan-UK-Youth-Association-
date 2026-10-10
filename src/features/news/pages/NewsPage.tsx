import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FlagDivider from "../../../components/ui/FlagDivider";
import NewsCard from "../NewsCard";
import { listPublishedArticles } from "../api";
import type { Article, NewsCategory } from "../../../types";
import { categoryColors } from "../../../constants";
import { NEWS_CATEGORIES, formatArticleDate, readTimeFromBody } from "../../../types";

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>("All");
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(1);
  const [articles, setArticles] = useState<Article[]>([]);
  const [featured, setFeatured] = useState<Article | null>(null);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(query), 250);
    return () => window.clearTimeout(t);
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [activeCategory, debounced]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void listPublishedArticles({ category: activeCategory, query: debounced, page }).then((result) => {
      if (cancelled) return;
      setArticles(result.articles);
      setFeatured(result.featured);
      setTotal(result.total);
      setPageSize(result.pageSize);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [activeCategory, debounced, page]);

  const gridArticles = useMemo(() => {
    if (!featured || page > 1 || activeCategory !== "All" || debounced) return articles;
    return articles.filter((a) => a.id !== featured.id);
  }, [articles, featured, page, activeCategory, debounced]);

  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="page-transition min-h-screen bg-[#F4F6FB]">
      <div className="bg-[#002060] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#CC2229] font-semibold text-sm uppercase tracking-wider mb-3">Community News</p>
          <h1 className="text-5xl text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Stories from our community
          </h1>
        </div>
      </div>
      <FlagDivider />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10">
          <div className="flex flex-wrap gap-2 flex-1">
            {NEWS_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-[#003580] text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles"
            aria-label="Search articles"
            className="w-full md:w-72 border border-gray-300 rounded-xl px-4 py-2.5 text-sm bg-white"
          />
        </div>

        {featured && page === 1 && activeCategory === "All" && !debounced && (
          <Link
            to={`/news/${featured.slug}`}
            className="grid md:grid-cols-2 gap-0 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-10 group"
          >
            <div className="aspect-[16/10] md:aspect-auto overflow-hidden bg-gray-100">
              <img src={featured.coverUrl} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#CC2229]">Featured</span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[featured.category]}`}>
                  {featured.category}
                </span>
              </div>
              <h2 className="text-3xl text-[#0D1B2A] mb-3 leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
                {featured.title}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">{featured.excerpt}</p>
              <p className="text-xs text-gray-400">
                {featured.authorName} · {formatArticleDate(featured.publishedAt)} · {readTimeFromBody(featured.body)}
              </p>
            </div>
          </Link>
        )}

        {loading ? (
          <p className="text-center py-20 text-gray-400">Loading stories…</p>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridArticles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
            {gridArticles.length === 0 && (
              <p className="text-center py-20 text-gray-400">No articles match this search.</p>
            )}
            {pageCount > 1 && (
              <div className="flex justify-center gap-3 mt-12">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-gray-500">
                  {page} / {pageCount}
                </span>
                <button
                  type="button"
                  disabled={page >= pageCount}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

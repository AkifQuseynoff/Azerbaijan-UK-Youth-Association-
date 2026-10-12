import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CoverImage from "../../../components/ui/CoverImage";
import PageHeader from "../../../components/ui/PageHeader";
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
    <div className="page-transition">
      <PageHeader eyebrow="Community news" title="Stories from our community" />

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex flex-1 flex-wrap gap-2" role="group" aria-label="Filter by category">
            {NEWS_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                aria-pressed={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-[background-color,color,transform] duration-150 active:scale-95 ${
                  activeCategory === cat ? "bg-ink text-white" : "bg-mist text-ink hover:bg-line"
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
            className="w-full rounded-full border border-line bg-white px-5 py-2.5 text-base md:w-72"
          />
        </div>

        {featured && page === 1 && activeCategory === "All" && !debounced && (
          <Link to={`/news/${featured.slug}`} className="card press group mb-10 grid overflow-hidden md:grid-cols-2">
            <div className="aspect-[16/10] overflow-hidden bg-mist md:aspect-auto">
              <CoverImage src={featured.coverUrl} imgClassName="h-full w-full object-cover transition-transform duration-500 [@media(hover:hover)]:group-hover:scale-105" />
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-10">
              <div className="mb-4 flex items-center gap-3">
                <span className="eyebrow">Featured</span>
                <span className={`chip ${categoryColors[featured.category] || "bg-mist text-ink"}`}>{featured.category}</span>
              </div>
              <h2 className="display mb-3 text-3xl">{featured.title}</h2>
              <p className="mb-6 text-mute">{featured.excerpt}</p>
              <p className="text-xs text-mute">
                {featured.authorName} · {formatArticleDate(featured.publishedAt)} · {readTimeFromBody(featured.body)}
              </p>
            </div>
          </Link>
        )}

        {loading ? (
          <p className="py-20 text-center text-mute">Loading stories…</p>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {gridArticles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
            {gridArticles.length === 0 && <p className="py-20 text-center text-mute">No articles match this search.</p>}
            {pageCount > 1 && (
              <div className="mt-12 flex items-center justify-center gap-3">
                <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="btn btn-outline btn-sm">
                  Previous
                </button>
                <span className="px-2 text-sm text-mute">
                  {page} / {pageCount}
                </span>
                <button type="button" disabled={page >= pageCount} onClick={() => setPage((p) => p + 1)} className="btn btn-outline btn-sm">
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

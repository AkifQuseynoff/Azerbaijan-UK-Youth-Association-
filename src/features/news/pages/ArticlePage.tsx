import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageHeader from "../../../components/ui/PageHeader";
import NewsCard from "../NewsCard";
import { MarkdownBody } from "../markdown";
import { getPublishedArticle, getRelatedArticles } from "../api";
import type { Article } from "../../../types";
import { formatArticleDate, readTimeFromBody } from "../../../types";

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!slug) return;
    setLoading(true);
    void (async () => {
      const found = await getPublishedArticle(slug);
      if (cancelled) return;
      setArticle(found);
      if (found) setRelated(await getRelatedArticles(found));
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return <p className="py-32 text-center text-mute">Loading article…</p>;
  }

  if (!article) {
    return (
      <div className="px-6 py-24 text-center">
        <h1 className="display mb-4 text-4xl">Article not found</h1>
        <Link to="/news" className="btn btn-blue">Back to news</Link>
      </div>
    );
  }

  return (
    <div className="page-transition">
      <PageHeader
        eyebrow={article.category}
        title={article.title}
        subtitle={article.excerpt}
        width="max-w-3xl"
      />
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <p className="-mt-6 mb-6 text-sm text-mute">
          <Link to="/news" className="font-semibold text-brand-blue underline underline-offset-4">News</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          {article.authorName} · {formatArticleDate(article.publishedAt)} · {readTimeFromBody(article.body)}
        </p>
        <div className="mb-10 aspect-[16/9] overflow-hidden rounded-3xl bg-mist shadow-card">
          <img src={article.coverUrl} alt="" className="h-full w-full object-cover" />
        </div>
        <article className="card p-6 sm:p-10">
          <MarkdownBody source={article.body} />
        </article>
      </div>
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <h2 className="display mb-6 text-3xl">Related stories</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((item) => (
              <NewsCard key={item.id} article={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

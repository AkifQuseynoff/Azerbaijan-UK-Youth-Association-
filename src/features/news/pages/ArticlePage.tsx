import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import FlagDivider from "../../../components/ui/FlagDivider";
import NewsCard from "../NewsCard";
import { MarkdownBody } from "../markdown";
import { getPublishedArticle, getRelatedArticles } from "../api";
import type { Article } from "../../../types";
import { categoryColors } from "../../../constants";
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
    return <p className="text-center py-32 text-gray-400">Loading article…</p>;
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#F4F6FB] py-24 text-center">
        <h1 className="text-3xl mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>Article not found</h1>
        <Link to="/news" className="text-[#003580] font-semibold">Back to news</Link>
      </div>
    );
  }

  return (
    <div className="page-transition min-h-screen bg-[#F4F6FB]">
      <div className="bg-[#002060] py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-blue-200 text-sm mb-4">
            <Link to="/news" className="hover:text-white">News</Link>
            <span className="mx-2">/</span>
            {article.category}
          </p>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[article.category]}`}>
            {article.category}
          </span>
          <h1 className="text-4xl md:text-5xl text-white mt-5 leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
            {article.title}
          </h1>
          <p className="text-blue-200 mt-6 text-lg">{article.excerpt}</p>
          <p className="text-blue-300 text-sm mt-6">
            {article.authorName} · {formatArticleDate(article.publishedAt)} · {readTimeFromBody(article.body)}
          </p>
        </div>
      </div>
      <FlagDivider />
      <div className="max-w-3xl mx-auto px-6 -mt-8 mb-10">
        <div className="rounded-2xl overflow-hidden shadow-xl aspect-[16/9] bg-gray-100">
          <img src={article.coverUrl} alt="" className="w-full h-full object-cover" />
        </div>
      </div>
      <article className="max-w-3xl mx-auto px-6 pb-8">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
          <MarkdownBody source={article.body} />
        </div>
      </article>
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-2xl mb-6" style={{ fontFamily: "'DM Serif Display', serif" }}>Related stories</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {related.map((item) => (
              <NewsCard key={item.id} article={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

import { Link } from "react-router-dom";
import type { Article } from "../types";
import { categoryColors, formatArticleDate, readTimeFromBody } from "../types";

export default function NewsCard({ article }: { article: Article }) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
      <Link to={`/news/${article.slug}`} className="block">
        <div className="aspect-[16/9] overflow-hidden bg-gray-100">
          <img
            src={article.coverUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[article.category] || "bg-gray-200"}`}>
              {article.category}
            </span>
            <span className="text-gray-400 text-xs">{readTimeFromBody(article.body)}</span>
          </div>
          <h3 className="text-lg font-bold text-[#0D1B2A] leading-snug mb-2 group-hover:text-[#003580] transition-colors" style={{ fontFamily: "'DM Serif Display', serif" }}>
            {article.title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4">{article.excerpt}</p>
          <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 pt-4">
            <span>{article.authorName}</span>
            <span>{formatArticleDate(article.publishedAt)}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

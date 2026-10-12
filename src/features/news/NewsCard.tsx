import { Link } from "react-router-dom";
import CoverImage from "../../components/ui/CoverImage";
import type { Article } from "../../types";
import { categoryColors } from "../../constants";
import { formatArticleDate, readTimeFromBody } from "../../types";

export default function NewsCard({ article }: { article: Article }) {
  return (
    <article className="card press group overflow-hidden transition-transform duration-200">
      <Link to={`/news/${article.slug}`} className="block h-full">
        <div className="aspect-[16/9] overflow-hidden bg-mist">
          <CoverImage src={article.coverUrl} imgClassName="h-full w-full object-cover transition-transform duration-500 [@media(hover:hover)]:group-hover:scale-105" />
        </div>
        <div className="p-6">
          <div className="mb-3 flex items-center gap-3">
            <span className={`chip ${categoryColors[article.category] || "bg-mist text-ink"}`}>{article.category}</span>
            <span className="text-xs text-mute">{readTimeFromBody(article.body)}</span>
          </div>
          <h3 className="mb-2 font-display text-[1.3rem] font-medium leading-snug tracking-tight transition-colors group-hover:text-brand-blue">{article.title}</h3>
          <p className="mb-4 line-clamp-3 text-[0.95rem] text-mute">{article.excerpt}</p>
          <div className="flex items-center justify-between border-t border-line pt-4 text-xs text-mute">
            <span>{article.authorName}</span>
            <span>{formatArticleDate(article.publishedAt)}</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

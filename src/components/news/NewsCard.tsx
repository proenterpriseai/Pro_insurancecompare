"use client";

import { NewsItem } from "@/types/news";
import { timeAgo, getInsuranceTypeLabel, getInsuranceTypeColor } from "@/lib/utils";

interface NewsCardProps {
  article: NewsItem;
}

export default function NewsCard({ article }: NewsCardProps) {
  return (
    <a
      href={article.original_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-border rounded-xl p-5 hover:border-primary hover:shadow-sm transition-all bg-white"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Category Badge */}
          {article.category && (
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${getInsuranceTypeColor(
                article.category
              )}`}
            >
              {getInsuranceTypeLabel(article.category)}
            </span>
          )}

          {/* Title */}
          <h3 className="font-bold text-foreground mb-2 leading-snug line-clamp-2">
            {article.title}
          </h3>

          {/* Description */}
          {article.description && (
            <p className="text-sm text-secondary line-clamp-2 mb-3">
              {article.description}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-2 text-xs text-secondary">
            {article.publisher && <span>{article.publisher}</span>}
            {article.publisher && article.published_at && <span>·</span>}
            {article.published_at && <span>{timeAgo(article.published_at)}</span>}
          </div>
        </div>
      </div>
    </a>
  );
}

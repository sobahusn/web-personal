import { Link } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import type { PostMeta } from "../../types/blog";
import { formatDate } from "../../lib/blog";

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      to={`/articles/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-theme bg-card transition-all duration-300 hover:border-purple-400/40 hover:shadow-theme"
    >
      {post.coverImage && (
        <div className="h-44 overflow-hidden">
          <img
            src={post.coverImage}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        {post.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-lg px-2.5 py-1 text-[11px] font-bold text-purple-500 dark:text-purple-300"
                style={{ backgroundColor: "rgba(139,92,246,0.1)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h2 className="mb-3 text-lg font-bold leading-snug text-theme transition-colors group-hover:text-purple-500">
          {post.title}
        </h2>
        {post.excerpt && <p className="mb-5 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">{post.excerpt}</p>}

        <div className="mt-auto flex items-center justify-between border-t border-theme pt-4 text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <Calendar size={12} />
            {formatDate(post.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} />
            {post.readingTime} min read
          </span>
        </div>
      </div>
    </Link>
  );
}

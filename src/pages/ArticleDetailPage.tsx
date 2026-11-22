import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { api, ApiError, errorMessage } from "../lib/api";
import { formatDate } from "../lib/blog";
import type { Post } from "../types/blog";
import { Markdown } from "../components/blog/Markdown";

const SITE_NAME = "Sobahusn";

export function ArticleDetailPage() {
  const { slug = "" } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<{
    status: number;
    message: string;
  } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setPost(null);
    setError(null);
    api
      .getPost(slug, false, controller.signal)
      .then(setPost)
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError({
          status: err instanceof ApiError ? err.status : 0,
          message: errorMessage(err),
        });
      });
    return () => controller.abort();
  }, [slug]);

  const back = (
    <Link
      to="/articles"
      className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-theme"
    >
      <ArrowLeft size={16} />
      Back to articles
    </Link>
  );

  if (error) {
    const notFound = error.status === 404 || error.status === 400;
    return (
      <div className="pt-[68px]">
        <div className="mx-auto max-w-3xl px-6 py-16 md:px-12">
          {back}
          <title>{`${notFound ? "Article not found" : "Error"} | ${SITE_NAME}`}</title>
          <h1 className="mb-3 text-3xl font-bold text-theme">
            {notFound ? "Article not found" : "Could not load this article"}
          </h1>
          <p className="text-muted">
            {notFound
              ? "It may have been moved, renamed or unpublished."
              : error.message}
          </p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-[68px]" aria-busy="true">
        <div className="mx-auto max-w-3xl px-6 py-16 md:px-12">
          {back}
          <div className="mb-4 h-10 w-3/4 animate-pulse rounded-lg bg-card" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-card" />
        </div>
      </div>
    );
  }

  const url = typeof window !== "undefined" ? window.location.href : "";
  const image = post.coverImage
    ? new URL(post.coverImage, window.location.origin).href
    : "";

  return (
    <div className="pt-[68px]">
      {/* React 19 hoists these into <head>. Social crawlers don't run JS, so
          /api/share serves the same tags to them (see vercel.json). */}
      <title>{`${post.title} | ${SITE_NAME}`}</title>
      <meta name="description" content={post.excerpt} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.excerpt} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}
      <meta property="article:published_time" content={post.date} />
      <meta
        name="twitter:card"
        content={image ? "summary_large_image" : "summary"}
      />

      <article className="mx-auto max-w-3xl px-6 py-16 md:px-12">
        {back}

        <header className="mb-10">
          {post.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
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
          <h1 className="mb-4 text-3xl font-bold leading-tight text-theme md:text-5xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-muted">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {post.readingTime} min read
            </span>
          </div>
        </header>

        {post.coverImage && (
          <img
            src={post.coverImage}
            alt=""
            className="mb-10 aspect-video w-full rounded-2xl border border-theme object-cover"
          />
        )}

        <Markdown>{post.content}</Markdown>
      </article>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { BookOpen, Search } from "lucide-react";
import { api, errorMessage } from "../lib/api";
import type { PostMeta } from "../types/blog";
import { PostCard } from "../components/blog/PostCard";

export function ArticlesPage() {
  const [posts, setPosts] = useState<PostMeta[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    api
      .listPosts(false, controller.signal)
      .then(setPosts)
      .catch((err) => {
        if (!controller.signal.aborted) setError(errorMessage(err));
      });
    return () => controller.abort();
  }, []);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    posts?.forEach((p) =>
      p.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)),
    );
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([t]) => t);
  }, [posts]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (posts ?? []).filter(
      (p) =>
        (!activeTag || p.tags.includes(activeTag)) &&
        (!q ||
          `${p.title} ${p.excerpt} ${p.tags.join(" ")}`
            .toLowerCase()
            .includes(q)),
    );
  }, [posts, query, activeTag]);

  return (
    <div className="pt-[68px]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div
            className="section-divider"
            style={{ backgroundColor: "#8b5cf6" }}
          />
          <h1 className="mb-3 flex items-center gap-3 text-4xl font-bold text-theme md:text-5xl">
            <BookOpen size={32} className="text-purple-500" />
            Articles
          </h1>
          <p className="text-muted">Thoughts, guides & developer journal</p>
        </motion.div>

        {posts && posts.length > 0 && (
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center">
            <label className="relative block md:w-72">
              <span className="sr-only">Search articles</span>
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles"
                className="w-full rounded-xl border border-theme bg-card py-2.5 pl-10 pr-4 text-sm text-theme placeholder:text-muted focus:border-purple-400 focus:outline-none"
              />
            </label>

            {tags.length > 0 && (
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label="Filter by tag"
              >
                {[null, ...tags].map((tag) => (
                  <button
                    key={tag ?? "all"}
                    type="button"
                    onClick={() => setActiveTag(tag)}
                    aria-pressed={activeTag === tag}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                      activeTag === tag
                        ? "border-purple-500 bg-purple-500 text-white"
                        : "border-theme text-muted hover:border-purple-400/60 hover:text-theme"
                    }`}
                  >
                    {tag ?? "All"}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {error && (
          <p
            role="alert"
            className="rounded-2xl border border-theme bg-card p-6 text-sm text-muted"
          >
            Articles could not be loaded. {error}
          </p>
        )}

        {!posts && !error && (
          <div
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            aria-busy="true"
            aria-label="Loading articles"
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-72 animate-pulse rounded-2xl border border-theme bg-card"
              />
            ))}
          </div>
        )}

        {posts && visible.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}

        {posts && visible.length === 0 && (
          <div className="py-24 text-center">
            <BookOpen size={40} className="mx-auto mb-4 text-muted" />
            <p className="text-muted">
              {posts.length === 0
                ? "No articles yet. Stay tuned!"
                : "No articles match your search."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

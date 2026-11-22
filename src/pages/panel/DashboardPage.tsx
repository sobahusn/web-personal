import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ExternalLink, FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { api, errorMessage, isUnauthorized } from "../../lib/api";
import { formatDate } from "../../lib/blog";
import type { PostMeta } from "../../types/blog";
import { Button } from "../../components/ui/Button";

export function DashboardPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostMeta[] | null>(null);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setPosts(await api.listPosts(true, signal));
        setError("");
      } catch (err) {
        if (signal?.aborted) return;
        if (isUnauthorized(err)) navigate("/panel/login", { replace: true });
        else setError(errorMessage(err));
      }
    },
    [navigate],
  );

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  async function remove(slug: string) {
    setDeleting(true);
    try {
      await api.deletePost(slug);
      setPosts((current) => current?.filter((p) => p.slug !== slug) ?? null);
      setConfirming(null);
    } catch (err) {
      if (isUnauthorized(err)) navigate("/panel/login", { replace: true });
      else setError(errorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <title>Articles | Panel</title>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Articles</h1>
          <p className="mt-1 text-sm text-muted">
            Each save is a commit to your GitHub repository. Published changes appear on the site within about a minute.
          </p>
        </div>
        <Button to="/panel/new" leftIcon={<Plus size={16} />}>
          New article
        </Button>
      </div>

      {error && (
        <p role="alert" className="mb-6 rounded-xl border border-red-500/40 bg-red-500/5 p-4 text-sm text-red-500">
          {error}
        </p>
      )}

      {!posts && !error && (
        <div className="space-y-3" aria-busy="true" aria-label="Loading articles">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl border border-theme bg-card" />
          ))}
        </div>
      )}

      {posts && posts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-theme py-20 text-center">
          <FileText size={36} className="mx-auto mb-4 text-muted" />
          <p className="mb-5 text-muted">No articles yet.</p>
          <Button to="/panel/new" leftIcon={<Plus size={16} />}>
            Write your first article
          </Button>
        </div>
      )}

      {posts && posts.length > 0 && (
        <ul className="divide-y divide-theme overflow-hidden rounded-2xl border border-theme bg-card">
          {posts.map((post) => (
            <li key={post.slug} className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <Link to={`/panel/edit/${post.slug}`} className="truncate font-semibold transition-colors hover:text-accent">
                    {post.title}
                  </Link>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      post.published ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="mt-1 truncate font-mono text-xs text-muted">
                  /articles/{post.slug} · {formatDate(post.date) || "No date"}
                </p>
              </div>

              {confirming === post.slug ? (
                <div className="flex shrink-0 items-center gap-2" role="alertdialog" aria-label={`Delete ${post.title}`}>
                  <span className="text-sm text-muted">Delete this article?</span>
                  <Button size="sm" variant="ghost" onClick={() => setConfirming(null)} disabled={deleting}>
                    Cancel
                  </Button>
                  <Button size="sm" variant="danger" isLoading={deleting} onClick={() => remove(post.slug)}>
                    Delete
                  </Button>
                </div>
              ) : (
                <div className="flex shrink-0 items-center gap-2">
                  {post.published && (
                    <Button to={`/articles/${post.slug}`} target="_blank" size="sm" variant="ghost" leftIcon={<ExternalLink size={14} />}>
                      View
                    </Button>
                  )}
                  <Button to={`/panel/edit/${post.slug}`} size="sm" variant="outline" leftIcon={<Pencil size={14} />}>
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setConfirming(post.slug)} leftIcon={<Trash2 size={14} />}>
                    Delete
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

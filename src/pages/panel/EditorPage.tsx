import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, ExternalLink, Save, TriangleAlert } from "lucide-react";
import { api, errorMessage, isUnauthorized } from "../../lib/api";
import { SLUG_RE, slugify, today } from "../../lib/blog";
import { prepareImage } from "../../lib/image";
import type { PostInput } from "../../types/blog";
import { Button } from "../../components/ui/Button";
import { ImageUploader } from "../../components/panel/ImageUploader";
import { MarkdownEditor } from "../../components/panel/MarkdownEditor";
import { TagInput } from "../../components/panel/TagInput";
import { hintClass, inputClass, labelClass } from "../../components/panel/ui";

type FormState = PostInput;
type Notice = { kind: "ok" | "error"; text: string };

const emptyForm = (): FormState => ({
  slug: "",
  title: "",
  date: today(),
  excerpt: "",
  coverImage: "",
  tags: [],
  published: false,
  content: "",
});

function validate(form: FormState): string | null {
  if (!form.title.trim()) return "Add a title before saving.";
  if (!SLUG_RE.test(form.slug) || form.slug.length > 100) {
    return "The slug can only contain lowercase letters, numbers and single hyphens, for example my-first-post.";
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(form.date)) return "Choose a publish date.";
  return null;
}

function Field({ label, htmlFor, hint, children }: { label: string; htmlFor?: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
      </label>
      {children}
      {hint && <p className={hintClass}>{hint}</p>}
    </div>
  );
}

/** Remount per article so each one starts from clean state. */
export function EditorPage() {
  const { slug } = useParams();
  return <Editor key={slug ?? "new"} slug={slug} />;
}

function Editor({ slug }: { slug?: string }) {
  const navigate = useNavigate();
  const location = useLocation();

  // After creating/renaming we navigate to /panel/edit/:slug and hand the form over,
  // so the page never re-reads a file GitHub may not have fully propagated yet.
  const [handoff] = useState(() => location.state as { form?: FormState; notice?: Notice } | null);
  const [initial] = useState<FormState>(() => handoff?.form ?? emptyForm());
  const [form, setForm] = useState<FormState>(initial);
  const [savedSnapshot, setSavedSnapshot] = useState(() => JSON.stringify(initial));
  const [slugTouched, setSlugTouched] = useState(Boolean(slug));
  const [loading, setLoading] = useState(Boolean(slug) && !handoff?.form);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(handoff?.notice ?? null);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const previewUrls = useRef<string[]>([]);

  const dirty = JSON.stringify(form) !== savedSnapshot;

  // Clear the handoff from history so a browser reload fetches fresh data.
  useEffect(() => {
    if (handoff) navigate(location.pathname, { replace: true, state: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!slug || handoff?.form) return;
    const controller = new AbortController();
    api
      .getPost(slug, true, controller.signal)
      .then(({ readingTime: _readingTime, ...post }) => {
        setForm(post);
        setSavedSnapshot(JSON.stringify(post));
        setLoading(false);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        if (isUnauthorized(err)) navigate("/panel/login", { replace: true });
        else {
          setLoadError(errorMessage(err));
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [slug, handoff, navigate]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    const urls = previewUrls.current;
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  function onTitleChange(title: string) {
    setForm((f) => ({ ...f, title, ...(slugTouched ? {} : { slug: slugify(title) }) }));
  }

  /** Optimise + upload to GitHub, and remember a local preview until the site redeploys. */
  async function uploadImage(file: File): Promise<string> {
    const image = await prepareImage(file);
    previewUrls.current.push(image.previewUrl);
    try {
      const path = await api.uploadImage(image.filename, image.base64);
      setPreviews((p) => ({ ...p, [path]: image.previewUrl }));
      return path;
    } catch (err) {
      if (isUnauthorized(err)) {
        throw new Error("Your session expired. Log in again in a new tab, then retry the upload.");
      }
      throw err;
    }
  }

  const resolveSrc = (src: string) => previews[src] ?? src;

  async function save() {
    if (saving) return;
    const problem = validate(form);
    if (problem) {
      setNotice({ kind: "error", text: problem });
      return;
    }
    setSaving(true);
    setNotice(null);
    try {
      if (slug) await api.updatePost(slug, form);
      else await api.createPost(form);

      const result: Notice = {
        kind: "ok",
        text: form.published
          ? "Saved and published. It appears on the site within about a minute."
          : "Draft saved. It stays private until you publish it.",
      };
      setSavedSnapshot(JSON.stringify(form));
      setNotice(result);
      if (form.slug !== slug) navigate(`/panel/edit/${form.slug}`, { replace: true, state: { form, notice: result } });
    } catch (err) {
      setNotice({
        kind: "error",
        text: isUnauthorized(err)
          ? "Your session expired. Log in again in a new tab, then save again. Your changes are still here."
          : errorMessage(err),
      });
    } finally {
      setSaving(false);
    }
  }

  function onKeyDown(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      void save();
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10" aria-busy="true">
        <div className="h-12 w-1/2 animate-pulse rounded-xl bg-card" />
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Link to="/panel" className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-theme">
          <ArrowLeft size={16} /> Back to articles
        </Link>
        <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/5 p-4 text-sm text-red-500">
          {loadError}
        </p>
      </main>
    );
  }

  return (
    <div onKeyDown={onKeyDown}>
      <title>{`${slug ? "Edit article" : "New article"} | Panel`}</title>

      <div className="sticky top-0 z-20 border-b border-theme bg-theme">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <Link to="/panel" className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-theme">
            <ArrowLeft size={16} />
            Articles
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted sm:inline" aria-live="polite">
              {saving ? "Saving…" : dirty ? "Unsaved changes" : "All changes saved"}
            </span>
            {slug && savedSnapshot && form.published && (
              <Button to={`/articles/${slug}`} target="_blank" size="sm" variant="ghost" leftIcon={<ExternalLink size={14} />}>
                View
              </Button>
            )}
            <Button size="sm" onClick={save} isLoading={saving} disabled={saving} leftIcon={<Save size={14} />}>
              {form.published ? "Save & publish" : "Save draft"}
            </Button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {notice && (
          <p
            role={notice.kind === "error" ? "alert" : "status"}
            className={`mb-6 flex items-start gap-2 rounded-xl border p-4 text-sm ${
              notice.kind === "error"
                ? "border-red-500/40 bg-red-500/5 text-red-500"
                : "border-emerald-500/40 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {notice.kind === "error" ? <TriangleAlert size={16} className="mt-0.5 shrink-0" /> : <Check size={16} className="mt-0.5 shrink-0" />}
            {notice.text}
          </p>
        )}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-6">
            <input
              value={form.title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Article title"
              aria-label="Title"
              maxLength={200}
              className="w-full border-b border-theme bg-transparent pb-3 text-3xl font-bold text-theme placeholder:text-muted focus:border-accent focus:outline-none md:text-4xl"
            />
            <MarkdownEditor value={form.content} onChange={(v) => update("content", v)} upload={uploadImage} resolveSrc={resolveSrc} />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <Field label="Status">
              <div role="radiogroup" aria-label="Status" className="grid grid-cols-2 gap-1 rounded-xl border border-theme bg-card p-1 text-sm font-medium">
                {([false, true] as const).map((published) => (
                  <button
                    key={String(published)}
                    type="button"
                    role="radio"
                    aria-checked={form.published === published}
                    onClick={() => update("published", published)}
                    className={`rounded-lg py-2 transition-colors ${
                      form.published === published ? "bg-accent text-white" : "text-muted hover:text-theme"
                    }`}
                  >
                    {published ? "Published" : "Draft"}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Publish date" htmlFor="date">
              <input id="date" type="date" value={form.date} onChange={(e) => update("date", e.target.value)} className={inputClass} />
            </Field>

            <Field
              label="Slug"
              htmlFor="slug"
              hint={slug && form.slug !== slug ? "Changing the slug changes the article's URL. Old links will stop working." : `Article URL: /articles/${form.slug || "…"}`}
            >
              <input
                id="slug"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  update("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"));
                }}
                maxLength={100}
                spellCheck={false}
                className={`${inputClass} font-mono`}
              />
            </Field>

            <Field label="Summary" htmlFor="excerpt" hint={`${form.excerpt.length}/500. Shown on cards and in link previews.`}>
              <textarea
                id="excerpt"
                value={form.excerpt}
                onChange={(e) => update("excerpt", e.target.value)}
                rows={3}
                maxLength={500}
                className={`${inputClass} resize-y`}
              />
            </Field>

            <Field label="Tags" htmlFor="tags">
              <TagInput id="tags" value={form.tags} onChange={(tags) => update("tags", tags)} />
            </Field>

            <Field label="Cover image" hint="Resized to 1600px wide and converted to WebP before upload. Appears on the site after Vercel finishes deploying (about a minute).">
              <ImageUploader value={form.coverImage} onChange={(v) => update("coverImage", v)} upload={uploadImage} resolveSrc={resolveSrc} />
            </Field>
          </aside>
        </div>
      </main>
    </div>
  );
}

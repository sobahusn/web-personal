import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  Save,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { api, errorMessage, isUnauthorized } from "../../lib/api";
import {
  clearDraft,
  draftKey,
  isBlank,
  loadDraft,
  saveDraft,
  type StoredDraft,
} from "../../lib/autosave";
import {
  SLUG_RE,
  adminMediaUrl,
  slugify,
  today,
  uniqueCopySlug,
} from "../../lib/blog";
import { prepareImage } from "../../lib/image";
import type { Post, PostForm } from "../../types/blog";
import { Button } from "../../components/ui/Button";
import { Autocomplete } from "../../components/panel/Autocomplete";
import { ConfirmDialog } from "../../components/panel/ConfirmDialog";
import { ImageUploader } from "../../components/panel/ImageUploader";
import { MarkdownEditor } from "../../components/panel/MarkdownEditor";
import { SocialCardPreview } from "../../components/panel/SocialCardPreview";
import { Switch } from "../../components/panel/Switch";
import { TagInput } from "../../components/panel/TagInput";
import { useTaxonomy } from "../../components/panel/useTaxonomy";
import { hintClass, inputClass, labelClass } from "../../components/panel/ui";

type Notice = { kind: "ok" | "error"; text: string };
interface Handoff {
  form?: PostForm;
  notice?: Notice;
}

const emptyForm = (): PostForm => ({
  slug: "",
  title: "",
  date: today(),
  excerpt: "",
  coverImage: "",
  category: "",
  tags: [],
  series: "",
  seriesOrder: null,
  featured: false,
  published: false,
  content: "",
});

/** `updated` is server-controlled and readingTime is derived: neither is editable. */
function fromPost({
  readingTime: _readingTime,
  updated: _updated,
  ...post
}: Post): PostForm {
  return post;
}

function validate(form: PostForm): string | null {
  if (!form.title.trim()) return "Add a title before saving.";
  if (!SLUG_RE.test(form.slug) || form.slug.length > 100) {
    return "The slug can only contain lowercase letters, numbers and single hyphens, for example my-first-post.";
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(form.date)) return "Choose a publish date.";
  if (
    form.series &&
    form.seriesOrder !== null &&
    (!Number.isInteger(form.seriesOrder) ||
      form.seriesOrder < 1 ||
      form.seriesOrder > 999)
  ) {
    return "Series order must be a whole number from 1 to 999.";
  }
  return null;
}

const formatWhen = (ms: number) =>
  new Date(ms).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
}) {
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
  const key = draftKey(slug);

  // After create/rename/duplicate we navigate with the form in router state, so the
  // page never re-reads a file GitHub may not have fully propagated yet.
  const [handoff] = useState(() => location.state as Handoff | null);
  const [initial] = useState<PostForm>(() => handoff?.form ?? emptyForm());
  const [form, setForm] = useState<PostForm>(initial);
  // A duplicate lives at /panel/new and is NOT saved yet, so it must count as unsaved.
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    JSON.stringify(slug ? initial : emptyForm()),
  );
  const [slugTouched, setSlugTouched] = useState(
    Boolean(slug) || Boolean(handoff?.form?.slug),
  );
  const [loading, setLoading] = useState(Boolean(slug) && !handoff?.form);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(handoff?.notice ?? null);
  const [commitMessage, setCommitMessage] = useState("");
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const previewUrls = useRef<string[]>([]);
  const taxonomy = useTaxonomy();

  const dirty = JSON.stringify(form) !== savedSnapshot;

  /* ---------- local auto-save and crash recovery ---------- */

  const [recovery, setRecovery] = useState<StoredDraft | null>(null);
  const [recoveryChecked, setRecoveryChecked] = useState(
    Boolean(handoff?.form),
  );
  const [backup, setBackup] = useState<"idle" | "ok" | "failed">("idle");

  // Once the saved version is known, look for a newer unsaved copy from a crashed/closed tab.
  useEffect(() => {
    if (recoveryChecked || loading || loadError) return;
    const draft = loadDraft(key);
    if (
      draft &&
      !isBlank(draft.form) &&
      JSON.stringify(draft.form) !== savedSnapshot
    )
      setRecovery(draft);
    else if (draft) clearDraft(key);
    setRecoveryChecked(true);
  }, [recoveryChecked, loading, loadError, key, savedSnapshot]);

  // Paused while a recovery decision is pending, so it can't overwrite the copy being offered.
  const autosaveOn = recoveryChecked && !recovery;
  useEffect(() => {
    if (!autosaveOn) return;
    if (!dirty) {
      clearDraft(key);
      setBackup("idle");
      return;
    }
    const timer = window.setTimeout(
      () => setBackup(saveDraft(key, form) ? "ok" : "failed"),
      800,
    );
    return () => window.clearTimeout(timer);
  }, [autosaveOn, dirty, form, key]);

  function restoreDraft() {
    if (!recovery) return;
    setForm(recovery.form);
    if (recovery.form.slug) setSlugTouched(true);
    setRecovery(null);
  }

  function discardDraft() {
    clearDraft(key);
    setRecovery(null);
  }

  /* ---------- loading, leaving ---------- */

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
      .then((post) => {
        const loaded = fromPost(post);
        setForm(loaded);
        setSavedSnapshot(JSON.stringify(loaded));
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

  /* ---------- editing ---------- */

  const update = <K extends keyof PostForm>(key: K, value: PostForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  function onTitleChange(title: string) {
    setForm((f) => ({
      ...f,
      title,
      ...(slugTouched ? {} : { slug: slugify(title) }),
    }));
  }

  function onSeriesChange(series: string) {
    setForm((f) => ({
      ...f,
      series,
      ...(series.trim() ? {} : { seriesOrder: null }),
    }));
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
        throw new Error(
          "Your session expired. Log in again in a new tab, then retry the upload.",
        );
      }
      throw err;
    }
  }

  // Fresh uploads: the local blob. Anything else: the admin proxy, which works before the site redeploys.
  const resolveSrc = (src: string) => previews[src] ?? adminMediaUrl(src);

  /* ---------- actions ---------- */

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
      const payload = {
        ...form,
        commitMessage: commitMessage.trim() || undefined,
        clientDate: today(),
      };
      if (slug) await api.updatePost(slug, payload);
      else await api.createPost(payload);

      const result: Notice = {
        kind: "ok",
        text: form.published
          ? "Saved and published. It appears on the site within about a minute."
          : "Draft saved. It stays private until you publish it.",
      };
      clearDraft(key);
      setBackup("idle");
      setCommitMessage("");
      setSavedSnapshot(JSON.stringify(form));
      setNotice(result);
      if (form.slug !== slug)
        navigate(`/panel/edit/${form.slug}`, {
          replace: true,
          state: { form, notice: result },
        });
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

  /** Opens a new, unsaved draft pre-filled from what is on screen (including unsaved edits). */
  function duplicate() {
    const copy: PostForm = {
      ...form,
      slug: uniqueCopySlug(form.slug, new Set(taxonomy.slugs)),
      title: form.title.trim() ? `${form.title.trim()} (copy)` : "",
      published: false,
      featured: false,
      date: today(),
    };
    navigate("/panel/new", {
      state: {
        form: copy,
        notice: {
          kind: "ok",
          text: "Duplicated as a draft. Nothing is saved until you press Save draft.",
        } satisfies Notice,
      },
    });
  }

  async function remove() {
    if (!slug) return;
    setDeleting(true);
    try {
      await api.deletePost(slug);
      clearDraft(key);
      navigate("/panel", { replace: true });
    } catch (err) {
      setConfirmDelete(false);
      setNotice({
        kind: "error",
        text: isUnauthorized(err)
          ? "Your session expired. Log in again in a new tab, then try again."
          : errorMessage(err),
      });
    } finally {
      setDeleting(false);
    }
  }

  // Ctrl/Cmd+S works wherever focus is (after Duplicate or Restore it is on the page body),
  // and replaces the browser's "Save page". Ignored while a modal dialog is open.
  const saveRef = useRef(save);
  useEffect(() => {
    saveRef.current = save;
  });
  useEffect(() => {
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        !e.shiftKey &&
        !e.altKey &&
        e.key.toLowerCase() === "s"
      ) {
        e.preventDefault();
        if (!document.querySelector("dialog[open]")) void saveRef.current();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  /* ---------- render ---------- */

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
        <Link
          to="/panel"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-theme"
        >
          <ArrowLeft size={16} /> Back to articles
        </Link>
        <p
          role="alert"
          className="rounded-xl border border-red-500/40 bg-red-500/5 p-4 text-sm text-red-500"
        >
          {loadError}
        </p>
      </main>
    );
  }

  const statusText = saving
    ? "Saving…"
    : !dirty
      ? "All changes saved"
      : backup === "ok"
        ? "Unsaved changes · backed up in this browser"
        : backup === "failed"
          ? "Unsaved changes · local backup unavailable"
          : "Unsaved changes";
  const defaultMessage = `content: ${form.published ? "publish" : "draft"} ${form.slug || "…"}`;

  return (
    <div>
      <title>{`${slug ? "Edit article" : "New article"} | Panel`}</title>

      <div className="sticky top-0 z-20 border-b border-theme bg-theme">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          <Link
            to="/panel"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-theme"
          >
            <ArrowLeft size={16} />
            Articles
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <span
              className="hidden text-xs text-muted lg:inline"
              aria-live="polite"
            >
              {statusText}
            </span>
            {slug && (
              <>
                {form.published && (
                  <Button
                    to={`/articles/${slug}`}
                    target="_blank"
                    size="sm"
                    variant="ghost"
                    leftIcon={<ExternalLink size={14} />}
                  >
                    <span className="hidden md:inline">View</span>
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={duplicate}
                  leftIcon={<Copy size={14} />}
                  title="Duplicate (copies what is on screen, including unsaved edits)"
                >
                  <span className="hidden md:inline">Duplicate</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setConfirmDelete(true)}
                  leftIcon={<Trash2 size={14} />}
                >
                  <span className="hidden md:inline">Delete</span>
                </Button>
              </>
            )}
            <Button
              size="sm"
              onClick={save}
              isLoading={saving}
              disabled={saving}
              leftIcon={<Save size={14} />}
            >
              {form.published ? "Save & publish" : "Save draft"}
            </Button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {recovery && (
          <div
            role="status"
            className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/40 bg-amber-500/5 p-4 text-sm text-theme"
          >
            <p>
              Unsaved changes from {formatWhen(recovery.savedAt)} were found in
              this browser.
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={restoreDraft}>
                Restore
              </Button>
              <Button size="sm" variant="ghost" onClick={discardDraft}>
                Discard
              </Button>
            </div>
          </div>
        )}

        {notice && (
          <p
            role={notice.kind === "error" ? "alert" : "status"}
            className={`mb-6 flex items-start gap-2 rounded-xl border p-4 text-sm ${
              notice.kind === "error"
                ? "border-red-500/40 bg-red-500/5 text-red-500"
                : "border-emerald-500/40 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {notice.kind === "error" ? (
              <TriangleAlert size={16} className="mt-0.5 shrink-0" />
            ) : (
              <Check size={16} className="mt-0.5 shrink-0" />
            )}
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
            <MarkdownEditor
              value={form.content}
              onChange={(v) => update("content", v)}
              upload={uploadImage}
              resolveSrc={resolveSrc}
            />
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:-mx-1 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto lg:px-1 lg:pb-2">
            <Field label="Status">
              <div
                role="radiogroup"
                aria-label="Status"
                className="grid grid-cols-2 gap-1 rounded-xl border border-theme bg-card p-1 text-sm font-medium"
              >
                {([false, true] as const).map((published) => (
                  <button
                    key={String(published)}
                    type="button"
                    role="radio"
                    aria-checked={form.published === published}
                    onClick={() => update("published", published)}
                    className={`rounded-lg py-2 transition-colors ${
                      form.published === published
                        ? "bg-accent text-white"
                        : "text-muted hover:text-theme"
                    }`}
                  >
                    {published ? "Published" : "Draft"}
                  </button>
                ))}
              </div>
            </Field>

            <Switch
              label="Featured"
              description="Pin this article to the top of the articles page."
              checked={form.featured ?? false}
              onChange={(v) => update("featured", v)}
            />

            <Field label="Publish date" htmlFor="date">
              <input
                id="date"
                type="date"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field
              label="Slug"
              htmlFor="slug"
              hint={
                slug && form.slug !== slug
                  ? "Changing the slug changes the article's URL. Old links will stop working."
                  : `Article URL: /articles/${form.slug || "…"}`
              }
            >
              <input
                id="slug"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  update(
                    "slug",
                    e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"),
                  );
                }}
                maxLength={100}
                spellCheck={false}
                className={`${inputClass} font-mono`}
              />
            </Field>

            <Field
              label="Category"
              htmlFor="category"
              hint="One per article. Suggestions come from your existing articles."
            >
              <Autocomplete
                id="category"
                value={form.category ?? ""}
                onChange={(v) => update("category", v)}
                suggestions={taxonomy.categories}
                maxLength={40}
                placeholder="e.g. Linux"
              />
            </Field>

            <Field
              label="Summary"
              htmlFor="excerpt"
              hint={`${form.excerpt.length}/500. Shown on cards and in link previews.`}
            >
              <textarea
                id="excerpt"
                value={form.excerpt}
                onChange={(e) => update("excerpt", e.target.value)}
                rows={3}
                maxLength={500}
                className={`${inputClass} resize-y`}
              />
            </Field>

            <SocialCardPreview
              title={form.title}
              excerpt={form.excerpt}
              image={form.coverImage ? resolveSrc(form.coverImage) : ""}
              host={window.location.host}
            />

            <Field label="Tags" htmlFor="tags">
              <TagInput
                id="tags"
                value={form.tags}
                onChange={(tags) => update("tags", tags)}
                suggestions={taxonomy.tags}
              />
            </Field>

            <div className="space-y-3">
              <Field
                label="Series"
                htmlFor="series"
                hint="Group multi-part articles. Leave empty if this is a standalone article."
              >
                <Autocomplete
                  id="series"
                  value={form.series ?? ""}
                  onChange={onSeriesChange}
                  suggestions={taxonomy.series}
                  maxLength={80}
                  placeholder="e.g. Linux hardening"
                />
              </Field>
              <Field label="Part number" htmlFor="seriesOrder">
                <input
                  id="seriesOrder"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={999}
                  step={1}
                  disabled={!form.series?.trim()}
                  value={form.seriesOrder ?? ""}
                  onChange={(e) =>
                    update(
                      "seriesOrder",
                      e.target.value === ""
                        ? null
                        : Math.trunc(Number(e.target.value)),
                    )
                  }
                  placeholder={form.series?.trim() ? "1" : "Set a series first"}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field
              label="Cover image"
              hint="Resized to 1600px wide and converted to WebP before upload. Appears on the site after Vercel finishes deploying (about a minute)."
            >
              <ImageUploader
                value={form.coverImage}
                onChange={(v) => update("coverImage", v)}
                upload={uploadImage}
                resolveSrc={resolveSrc}
              />
            </Field>

            <Field
              label="Commit message (optional)"
              htmlFor="commit"
              hint="Used for the next save only. Leave empty for the default."
            >
              <input
                id="commit"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                maxLength={100}
                placeholder={defaultMessage}
                className={`${inputClass} font-mono text-xs`}
              />
            </Field>
          </aside>
        </div>
      </main>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this article?"
        confirmLabel="Delete article"
        busy={deleting}
        onConfirm={remove}
        onCancel={() => setConfirmDelete(false)}
      >
        <p>
          “{form.title || slug}” will be removed from your repository (
          <span className="font-mono">{slug}.md</span>). Uploaded images stay in
          the media folder. This can be undone only from Git history.
        </p>
      </ConfirmDialog>
    </div>
  );
}

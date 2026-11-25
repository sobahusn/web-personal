/** "Hello, World! 2026" -> "hello-world-2026" (accents stripped, max 100 chars) */
export function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100)
    .replace(/-+$/g, "");
}

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Today as YYYY-MM-DD in the visitor's local timezone (not UTC). */
export function today(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
}

/**
 * Images committed through the panel are not on the public site until Vercel
 * redeploys, so editor views load them through the admin-only proxy instead.
 * Anything else (external URLs, other paths) is returned unchanged.
 */
export function adminMediaUrl(src: string): string {
  const match = /^\/images\/blog\/([A-Za-z0-9][A-Za-z0-9._-]*)$/.exec(src);
  return match ? `/api/media/file?name=${encodeURIComponent(match[1])}` : src;
}

/** First "<base>-copy", then "-copy-2", "-copy-3"... that is not in `taken`. */
export function uniqueCopySlug(
  base: string,
  taken: ReadonlySet<string>,
): string {
  const root = `${(base || "post").slice(0, 88).replace(/-+$/, "")}-copy`;
  if (!taken.has(root)) return root;
  for (let i = 2; ; i++) if (!taken.has(`${root}-${i}`)) return `${root}-${i}`;
}

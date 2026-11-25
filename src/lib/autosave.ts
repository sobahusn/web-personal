import { today } from "./blog";
import type { PostForm } from "../types/blog";

/**
 * Local crash-recovery copy of the editor form, kept in localStorage.
 * Everything read back is treated as untrusted (it can be stale, truncated
 * or edited by hand) and coerced to a valid PostForm or dropped.
 * Storage can be unavailable or full (private mode, quota): all calls are
 * guarded and report failure instead of throwing.
 */

const PREFIX = "panel:draft:";
const VERSION = 1;

export const draftKey = (slug?: string) => `${PREFIX}${slug ?? "new"}`;

export interface StoredDraft {
  savedAt: number;
  form: PostForm;
}

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.slice(0, max) : "";

export function coerceForm(raw: unknown): PostForm | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const order = r.seriesOrder;
  const date = str(r.date, 10);
  return {
    slug: str(r.slug, 100),
    title: str(r.title, 200),
    date: /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : today(),
    excerpt: str(r.excerpt, 500),
    coverImage: str(r.coverImage, 500),
    category: str(r.category, 40),
    tags: Array.isArray(r.tags)
      ? r.tags
          .filter((t): t is string => typeof t === "string" && t.length <= 32)
          .slice(0, 10)
      : [],
    series: str(r.series, 80),
    seriesOrder:
      typeof order === "number" &&
      Number.isInteger(order) &&
      order >= 1 &&
      order <= 999
        ? order
        : null,
    featured: r.featured === true,
    published: r.published === true,
    content: str(r.content, 400_000),
  };
}

/** True when the form holds nothing worth recovering. */
export const isBlank = (f: PostForm) =>
  !f.title.trim() &&
  !f.content.trim() &&
  !f.excerpt.trim() &&
  !f.coverImage &&
  !f.category &&
  !f.series &&
  f.tags.length === 0;

export function saveDraft(key: string, form: PostForm): boolean {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({ v: VERSION, savedAt: Date.now(), form }),
    );
    return true;
  } catch {
    return false;
  }
}

export function clearDraft(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* storage unavailable */
  }
}

export function loadDraft(key: string): StoredDraft | null {
  try {
    const text = localStorage.getItem(key);
    if (!text) return null;
    const data = JSON.parse(text) as {
      v?: unknown;
      savedAt?: unknown;
      form?: unknown;
    };
    const form = data.v === VERSION ? coerceForm(data.form) : null;
    if (!form || typeof data.savedAt !== "number") {
      clearDraft(key);
      return null;
    }
    return { savedAt: data.savedAt, form };
  } catch {
    clearDraft(key);
    return null;
  }
}

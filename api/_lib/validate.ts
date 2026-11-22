import type { PostInput } from "../../src/types/blog.js";
import { HttpError } from "./http.js";

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Only [a-z0-9-] ever reaches a repository path, so traversal is impossible. */
export function assertSlug(value: unknown): string {
  if (typeof value !== "string" || value.length < 1 || value.length > 100 || !SLUG_RE.test(value)) {
    throw new HttpError(400, "Slug may only contain lowercase letters, numbers and single hyphens (max 100 characters)");
  }
  return value;
}

function text(body: Record<string, unknown>, key: string, max: number, required = false): string {
  const raw = body[key];
  if (raw === undefined || raw === null || raw === "") {
    if (required) throw new HttpError(400, `${key} is required`);
    return "";
  }
  if (typeof raw !== "string") throw new HttpError(400, `${key} must be text`);
  const value = raw.trim();
  if (required && !value) throw new HttpError(400, `${key} is required`);
  if (value.length > max) throw new HttpError(400, `${key} is too long (max ${max} characters)`);
  return value;
}

function validCoverImage(value: string): boolean {
  if (value === "") return true;
  if (value.startsWith("/images/blog/")) return /^\/images\/blog\/[A-Za-z0-9._-]+$/.test(value) && !value.includes("..");
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function validatePostInput(raw: unknown): PostInput {
  if (!raw || typeof raw !== "object") throw new HttpError(400, "Invalid request body");
  const body = raw as Record<string, unknown>;

  const title = text(body, "title", 200, true);
  if (/[\r\n]/.test(title)) throw new HttpError(400, "title must be a single line");

  const slug = assertSlug(body.slug);

  const date = text(body, "date", 10, true);
  if (!DATE_RE.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
    throw new HttpError(400, "date must be a valid YYYY-MM-DD date");
  }

  const excerpt = text(body, "excerpt", 500);

  const coverImage = text(body, "coverImage", 500);
  if (!validCoverImage(coverImage)) throw new HttpError(400, "coverImage must be an /images/blog/ path or an http(s) URL");

  if (typeof body.published !== "boolean") throw new HttpError(400, "published must be true or false");

  const rawTags = body.tags ?? [];
  if (!Array.isArray(rawTags) || rawTags.length > 10) throw new HttpError(400, "tags must be a list of at most 10 items");
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const tag of rawTags) {
    if (typeof tag !== "string") throw new HttpError(400, "tags must be text");
    const clean = tag.trim();
    if (!clean) continue;
    if (clean.length > 32 || /[\r\n]/.test(clean)) throw new HttpError(400, "each tag must be a single line of at most 32 characters");
    if (!seen.has(clean.toLowerCase())) {
      seen.add(clean.toLowerCase());
      tags.push(clean);
    }
  }

  if (typeof body.content !== "string") throw new HttpError(400, "content must be text");
  if (body.content.length > 400_000) throw new HttpError(400, "content is too long");

  return { slug, title, date, excerpt, coverImage, tags, published: body.published, content: body.content };
}

/** Turn an arbitrary client filename into a safe base name (no extension, no path). */
export function sanitizeFilename(name: unknown): string {
  const base = typeof name === "string" ? (name.split(/[\\/]/).pop() ?? "") : "";
  const cleaned = base
    .replace(/\.[^.]*$/, "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return cleaned || "image";
}

/**
 * Identify the image by its magic bytes instead of trusting the filename or
 * MIME type. SVG is intentionally unsupported (it can carry scripts).
 */
export function detectImageExtension(buf: Buffer): "png" | "jpg" | "gif" | "webp" | "avif" | null {
  if (buf.length < 12) return null;
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf.subarray(0, 4).toString("ascii") === "GIF8") return "gif";
  if (buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") return "webp";
  if (buf.subarray(4, 12).toString("ascii") === "ftypavif") return "avif";
  return null;
}

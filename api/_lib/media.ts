import { HttpError } from "./http.js";
import { listPostsWithContent } from "./posts.js";

export const MEDIA_DIR = "public/images/blog";

const CONTENT_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
};

/** A plain image filename: no path separators, no "..", a known image extension. */
const NAME_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,150}\.(png|jpe?g|gif|webp|avif)$/i;

export function isMediaName(value: unknown): value is string {
  return typeof value === "string" && NAME_RE.test(value) && !value.includes("..");
}

export function assertMediaName(value: unknown): string {
  if (!isMediaName(value)) throw new HttpError(400, "Invalid image name");
  return value;
}

export function contentTypeFor(name: string): string {
  return CONTENT_TYPES[name.slice(name.lastIndexOf(".") + 1).toLowerCase()] ?? "application/octet-stream";
}

/** Uploads are named `<Date.now()>-<name>.<ext>`; recover the upload time when present. */
export function uploadedAt(name: string): string | null {
  const match = /^(\d{12,14})-/.exec(name);
  if (!match) return null;
  const date = new Date(Number(match[1]));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

/**
 * Which posts reference each image (drafts included). Looks for `/images/blog/<name>`
 * anywhere in the body or cover field, so absolute URLs to this site count too.
 * Returns slugs per image name.
 */
export async function mediaUsage(): Promise<Map<string, string[]>> {
  const usage = new Map<string, Set<string>>();
  for (const post of await listPostsWithContent()) {
    for (const text of [post.content, post.coverImage]) {
      for (const match of text.matchAll(/\/images\/blog\/([A-Za-z0-9][A-Za-z0-9._-]*)/g)) {
        const name = match[1].replace(/[.-]+$/, ""); // trailing sentence punctuation is not part of the name
        if (!usage.has(name)) usage.set(name, new Set());
        usage.get(name)!.add(post.slug);
      }
    }
  }
  return new Map([...usage].map(([name, slugs]) => [name, [...slugs].sort()]));
}

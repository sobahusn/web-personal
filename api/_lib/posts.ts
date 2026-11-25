import { parse, stringify } from "yaml";
import type { Post, PostInput, PostMeta } from "../../src/types/blog.js";
import { deleteFile, getFile, listDir, putFile } from "./github.js";
import { SLUG_RE, assertSlug } from "./validate.js";

const DIR = "content/blog";
const pathFor = (slug: string) => `${DIR}/${assertSlug(slug)}.md`;

export function readingTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function asDate(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime()))
    return value.toISOString().slice(0, 10);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value))
    return value.slice(0, 10);
  return "";
}

/** Hand-edited files may hold anything: coerce to a short single-line string. */
function asText(value: unknown, max: number): string {
  return typeof value === "string"
    ? value.replace(/\s+/g, " ").trim().slice(0, max)
    : "";
}

function asOrder(value: unknown): number | null {
  return typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 999
    ? value
    : null;
}

function asTags(value: unknown): string[] {
  const list = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : [];
  return list.map((t) => String(t).trim()).filter(Boolean);
}

/** Parse "---\nyaml\n---\nbody". Hand-edited or malformed files degrade to drafts instead of crashing. */
export function parseMarkdown(slug: string, raw: string): Post {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  let data: Record<string, unknown> = {};
  let body = raw;
  if (match) {
    body = match[2];
    try {
      const parsed: unknown = parse(match[1]);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed))
        data = parsed as Record<string, unknown>;
    } catch {
      data = {};
    }
  }
  // toMarkdown ends files with one newline; drop it (and any trailing blanks) so load -> save round-trips exactly.
  const content = body.replace(/^\r?\n/, "").trimEnd();
  const series = asText(data.series, 80);
  return {
    slug,
    title:
      typeof data.title === "string" && data.title.trim()
        ? data.title.trim()
        : slug,
    date: asDate(data.date),
    updated: asDate(data.updated),
    excerpt: typeof data.excerpt === "string" ? data.excerpt : "",
    coverImage: typeof data.coverImage === "string" ? data.coverImage : "",
    category: asText(data.category, 40),
    tags: asTags(data.tags),
    series,
    seriesOrder: series ? asOrder(data.seriesOrder) : null,
    featured: data.featured === true,
    published: data.published === true,
    readingTime: readingTime(content),
    content,
  };
}

/** Optional fields are written only when set, so untouched posts keep their exact frontmatter. */
export function toMarkdown(input: PostInput & { updated?: string }): string {
  const meta: Record<string, unknown> = {
    title: input.title,
    date: input.date,
  };
  if (input.updated) meta.updated = input.updated;
  meta.excerpt = input.excerpt;
  meta.coverImage = input.coverImage;
  if (input.category) meta.category = input.category;
  meta.tags = input.tags;
  if (input.series) {
    meta.series = input.series;
    if (input.seriesOrder) meta.seriesOrder = input.seriesOrder;
  }
  if (input.featured) meta.featured = true;
  meta.published = input.published;

  const frontmatter = stringify(meta, {
    lineWidth: 0,
    defaultStringType: "QUOTE_DOUBLE",
    defaultKeyType: "PLAIN",
  });
  return `---\n${frontmatter}---\n\n${input.content.replace(/\r\n/g, "\n").trimEnd()}\n`;
}

/** True when anything a reader could notice differs. A pure slug rename does not count. */
export function contentChanged(existing: Post, next: PostInput): boolean {
  const canonical = (p: PostInput) =>
    JSON.stringify([
      p.title,
      p.date,
      p.excerpt,
      p.coverImage,
      p.category ?? "",
      p.tags,
      p.series ?? "",
      p.seriesOrder ?? null,
      p.featured ?? false,
      p.published,
      p.content.replace(/\r\n/g, "\n").trimEnd(),
    ]);
  return canonical(existing) !== canonical(next);
}

export function toMeta({ content: _content, ...meta }: Post): PostMeta {
  return meta;
}

export async function getPost(slug: string): Promise<Post | null> {
  const file = await getFile(pathFor(slug));
  return file ? parseMarkdown(slug, file.content) : null;
}

async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        results[i] = await fn(items[i]);
      }
    }),
  );
  return results;
}

/** Every post with its body (drafts included), newest first. One GitHub call per post. */
export async function listPostsWithContent(): Promise<Post[]> {
  const entries = (await listDir(DIR)).filter(
    (e) => e.name.endsWith(".md") && SLUG_RE.test(e.name.slice(0, -3)),
  );
  const posts = await mapLimit(entries, 6, async (entry) => {
    const file = await getFile(entry.path);
    return file ? parseMarkdown(entry.name.slice(0, -3), file.content) : null;
  });
  return posts
    .filter((p): p is Post => p !== null)
    .sort(
      (a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title),
    );
}

/** All posts without bodies (drafts included), newest first. Callers decide what to expose. */
export async function listPosts(): Promise<PostMeta[]> {
  return (await listPostsWithContent()).map(toMeta);
}

export async function savePost(
  input: PostInput,
  message: string,
  updated = "",
): Promise<Post> {
  await putFile(
    pathFor(input.slug),
    toMarkdown({ ...input, updated }),
    message,
  );
  return {
    ...input,
    category: input.category ?? "",
    series: input.series ?? "",
    seriesOrder: input.seriesOrder ?? null,
    featured: input.featured ?? false,
    updated,
    readingTime: readingTime(input.content),
  };
}

export async function removePost(slug: string): Promise<boolean> {
  return deleteFile(pathFor(slug), `content: delete ${slug}`);
}

export async function postExists(slug: string): Promise<boolean> {
  return (await getFile(pathFor(slug))) !== null;
}

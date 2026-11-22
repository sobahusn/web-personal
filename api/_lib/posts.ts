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
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  return "";
}

function asTags(value: unknown): string[] {
  const list = Array.isArray(value) ? value : typeof value === "string" ? value.split(",") : [];
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
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) data = parsed as Record<string, unknown>;
    } catch {
      data = {};
    }
  }
  const content = body.replace(/^\r?\n/, "");
  return {
    slug,
    title: typeof data.title === "string" && data.title.trim() ? data.title.trim() : slug,
    date: asDate(data.date),
    excerpt: typeof data.excerpt === "string" ? data.excerpt : "",
    coverImage: typeof data.coverImage === "string" ? data.coverImage : "",
    tags: asTags(data.tags),
    published: data.published === true,
    readingTime: readingTime(content),
    content,
  };
}

export function toMarkdown(input: PostInput): string {
  const frontmatter = stringify(
    {
      title: input.title,
      date: input.date,
      excerpt: input.excerpt,
      coverImage: input.coverImage,
      tags: input.tags,
      published: input.published,
    },
    { lineWidth: 0, defaultStringType: "QUOTE_DOUBLE", defaultKeyType: "PLAIN" },
  );
  return `---\n${frontmatter}---\n\n${input.content.replace(/\r\n/g, "\n").trimEnd()}\n`;
}

export function toMeta({ content: _content, ...meta }: Post): PostMeta {
  return meta;
}

export async function getPost(slug: string): Promise<Post | null> {
  const file = await getFile(pathFor(slug));
  return file ? parseMarkdown(slug, file.content) : null;
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
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

/** All posts (drafts included), newest first. Callers decide what to expose. */
export async function listPosts(): Promise<PostMeta[]> {
  const entries = (await listDir(DIR)).filter((e) => e.name.endsWith(".md") && SLUG_RE.test(e.name.slice(0, -3)));
  const posts = await mapLimit(entries, 6, async (entry) => {
    const slug = entry.name.slice(0, -3);
    const file = await getFile(entry.path);
    return file ? toMeta(parseMarkdown(slug, file.content)) : null;
  });
  return posts
    .filter((p): p is PostMeta => p !== null)
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}

export async function savePost(input: PostInput, message: string): Promise<Post> {
  await putFile(pathFor(input.slug), toMarkdown(input), message);
  return { ...input, readingTime: readingTime(input.content) };
}

export async function removePost(slug: string): Promise<boolean> {
  return deleteFile(pathFor(slug), `content: delete ${slug}`);
}

export async function postExists(slug: string): Promise<boolean> {
  return (await getFile(pathFor(slug))) !== null;
}

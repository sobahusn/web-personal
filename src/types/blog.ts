/** Metadata stored in the YAML frontmatter of content/blog/<slug>.md */
export interface PostMeta {
  slug: string;
  title: string;
  /** ISO calendar date, YYYY-MM-DD */
  date: string;
  /** Last meaningful edit, YYYY-MM-DD. Set by the server; "" when never edited. */
  updated: string;
  excerpt: string;
  /** "" | "/images/blog/..." | "https://..." */
  coverImage: string;
  /** Single free-form category, "" when unset */
  category: string;
  tags: string[];
  /** Optional multi-part series; seriesOrder is its 1-based position */
  series: string;
  seriesOrder: number | null;
  /** Pinned to the top of the index */
  featured: boolean;
  published: boolean;
  /** Minutes, derived from the body on the server */
  readingTime: number;
}

export interface Post extends PostMeta {
  /** Markdown body (without frontmatter) */
  content: string;
}

/**
 * What the editor sends when creating/updating a post. `updated` is controlled
 * by the server, and the optional fields default to empty/false when omitted,
 * so older clients keep working.
 */
export type PostInput = Omit<
  Post,
  "readingTime" | "updated" | "category" | "series" | "seriesOrder" | "featured"
> &
  Partial<Pick<Post, "category" | "series" | "seriesOrder" | "featured">>;

/** Extra, non-persisted request fields accepted alongside a PostInput. */
export interface SaveOptions {
  /** Custom Git commit message (max 100 chars, single line). Blank = default. */
  commitMessage?: string;
  /** Browser-local date (YYYY-MM-DD) used for `updated`, avoiding UTC off-by-one. */
  clientDate?: string;
}

/**
 * The editor's working copy of a post: every optional field is present so
 * inputs stay controlled. `updated` is server-controlled and never edited.
 */
export type PostForm = PostInput &
  Required<Pick<PostInput, "category" | "series" | "seriesOrder" | "featured">>;

/** One image in public/images/blog, as listed by GET /api/media (admin). */
export interface MediaFile {
  name: string;
  /** Public path, e.g. /images/blog/1795342152373-cover.webp */
  path: string;
  size: number;
  /** ISO time parsed from the upload timestamp prefix; null for hand-added files */
  uploadedAt: string | null;
  /** Slugs of posts (drafts included) that reference this image */
  usedBy: string[];
}

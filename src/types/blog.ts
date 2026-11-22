/** Metadata stored in the YAML frontmatter of content/blog/<slug>.md */
export interface PostMeta {
  slug: string;
  title: string;
  /** ISO calendar date, YYYY-MM-DD */
  date: string;
  excerpt: string;
  /** "" | "/images/blog/..." | "https://..." */
  coverImage: string;
  tags: string[];
  published: boolean;
  /** Minutes, derived from the body on the server */
  readingTime: number;
}

export interface Post extends PostMeta {
  /** Markdown body (without frontmatter) */
  content: string;
}

/** What the editor sends when creating/updating a post */
export type PostInput = Omit<Post, "readingTime">;

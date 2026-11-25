import type { Post, PostInput, PostMeta, SaveOptions } from "../types/blog";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const isUnauthorized = (err: unknown) =>
  err instanceof ApiError && err.status === 401;
export const errorMessage = (err: unknown) =>
  err instanceof Error ? err.message : "Something went wrong";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
}

async function request<T>(
  url: string,
  { method = "GET", body, signal }: RequestOptions = {},
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers:
        body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      credentials: "same-origin",
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new ApiError(
      0,
      "Could not reach the server. Check your connection and try again.",
    );
  }

  const isJson = (res.headers.get("content-type") ?? "").includes(
    "application/json",
  );
  const data = isJson
    ? ((await res.json().catch(() => null)) as { error?: string } | null)
    : null;

  if (!res.ok)
    throw new ApiError(
      res.status,
      data?.error ?? `Request failed (${res.status})`,
    );
  if (!isJson) {
    // Plain `vite dev` has no /api and answers with index.html.
    throw new ApiError(
      res.status,
      "The API is not reachable. When developing locally, run `vercel dev` instead of `vite`.",
    );
  }
  return data as T;
}

const slugUrl = (slug: string, admin: boolean) =>
  `/api/posts/${encodeURIComponent(slug)}${admin ? "?scope=admin" : ""}`;

export const api = {
  /** Public list = published only. admin = true includes drafts (needs a session). */
  listPosts: (admin = false, signal?: AbortSignal) =>
    request<{ posts: PostMeta[] }>(`/api/posts${admin ? "?scope=admin" : ""}`, {
      signal,
    }).then((r) => r.posts),

  getPost: (slug: string, admin = false, signal?: AbortSignal) =>
    request<{ post: Post }>(slugUrl(slug, admin), { signal }).then(
      (r) => r.post,
    ),

  createPost: (input: PostInput & SaveOptions) =>
    request<{ post: PostMeta }>("/api/posts", {
      method: "POST",
      body: input,
    }).then((r) => r.post),

  updatePost: (slug: string, input: PostInput & SaveOptions) =>
    request<{ post: PostMeta }>(slugUrl(slug, false), {
      method: "PUT",
      body: input,
    }).then((r) => r.post),

  deletePost: (slug: string) =>
    request<{ ok: true }>(slugUrl(slug, false), { method: "DELETE" }),

  me: (signal?: AbortSignal) =>
    request<{ authenticated: boolean }>("/api/auth/me", { signal }),
  login: (password: string) =>
    request<{ ok: true }>("/api/auth/login", {
      method: "POST",
      body: { password },
    }),
  logout: () =>
    request<{ ok: true }>("/api/auth/logout", { method: "POST", body: {} }),

  uploadImage: (filename: string, data: string) =>
    request<{ path: string }>("/api/upload", {
      method: "POST",
      body: { filename, data },
    }).then((r) => r.path),
};

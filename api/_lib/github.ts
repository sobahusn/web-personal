import { HttpError, misconfigured } from "./http.js";

/**
 * Thin client for the GitHub Contents API. Server-side only: it reads
 * GITHUB_TOKEN from the environment and never returns it to callers.
 *
 * As defence in depth, it refuses to touch any path outside these folders,
 * no matter what the calling code passes in.
 */
const ALLOWED_PREFIXES = ["content/blog/", "public/images/blog/"];
const API = "https://api.github.com";

interface Config {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

function config(): Config {
  const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH } = process.env;
  if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
    misconfigured("GITHUB_TOKEN, GITHUB_OWNER and GITHUB_REPO must be set");
  }
  return { token: GITHUB_TOKEN, owner: GITHUB_OWNER, repo: GITHUB_REPO, branch: GITHUB_BRANCH || "main" };
}

function assertAllowedPath(path: string): void {
  const segments = path.split("/");
  const ok =
    ALLOWED_PREFIXES.some((prefix) => path.startsWith(prefix) || `${path}/` === prefix) &&
    /^[A-Za-z0-9._\-/]+$/.test(path) &&
    segments.every((s) => s !== "" && s !== "." && s !== "..");
  if (!ok) throw new HttpError(400, "Invalid file path");
}

async function request(method: "GET" | "PUT" | "DELETE", path: string, body?: Record<string, unknown>): Promise<Response> {
  assertAllowedPath(path);
  const c = config();
  const encoded = path.split("/").map(encodeURIComponent).join("/");
  const url = new URL(`${API}/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}/contents/${encoded}`);
  if (method === "GET") url.searchParams.set("ref", c.branch);
  return fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${c.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "portfolio-panel",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify({ ...body, branch: c.branch }) : undefined,
  });
}

function githubError(res: Response, action: string): HttpError {
  console.error(`[github] ${action} failed with ${res.status}`);
  if (res.status === 401 || res.status === 403) {
    return new HttpError(502, "GitHub rejected the request. Check GITHUB_TOKEN permissions (Contents: Read and write).");
  }
  if (res.status === 429) return new HttpError(503, "GitHub rate limit reached. Try again shortly.");
  if (res.status === 409 || res.status === 422) return new HttpError(409, "The file changed on GitHub while saving. Reload and try again.");
  return new HttpError(502, `GitHub request failed (${res.status})`);
}

export interface RepoFile {
  path: string;
  sha: string;
  /** UTF-8 text content */
  content: string;
}

interface ContentsFile {
  type: "file";
  path: string;
  sha: string;
  content?: string;
  encoding?: string;
}

export async function getFile(path: string): Promise<RepoFile | null> {
  const res = await request("GET", path);
  if (res.status === 404) return null;
  if (!res.ok) throw githubError(res, "get file");
  const data = (await res.json()) as ContentsFile | unknown[];
  if (Array.isArray(data) || data.type !== "file") return null;
  const content = Buffer.from((data.content ?? "").replace(/\n/g, ""), "base64").toString("utf8");
  return { path: data.path, sha: data.sha, content };
}

async function getSha(path: string): Promise<string | null> {
  const res = await request("GET", path);
  if (res.status === 404) return null;
  if (!res.ok) throw githubError(res, "get sha");
  const data = (await res.json()) as { sha?: string };
  return data.sha ?? null;
}

export interface DirEntry {
  name: string;
  path: string;
  sha: string;
}

/** Files directly inside a folder. A folder that does not exist yet is just empty. */
export async function listDir(path: string): Promise<DirEntry[]> {
  const res = await request("GET", path);
  if (res.status === 404) return [];
  if (!res.ok) throw githubError(res, "list directory");
  const data = (await res.json()) as Array<{ type: string; name: string; path: string; sha: string }>;
  if (!Array.isArray(data)) return [];
  return data.filter((e) => e.type === "file").map(({ name, path: p, sha }) => ({ name, path: p, sha }));
}

/**
 * Create or update a file. If it already exists its blob sha is looked up
 * automatically (GitHub requires it), with one retry if someone else
 * committed in between.
 */
export async function putFile(path: string, content: string | Buffer, message: string): Promise<void> {
  const base64 = Buffer.isBuffer(content) ? content.toString("base64") : Buffer.from(content, "utf8").toString("base64");
  for (let attempt = 0; ; attempt++) {
    const sha = await getSha(path);
    const res = await request("PUT", path, { message, content: base64, ...(sha ? { sha } : {}) });
    if (res.ok) return;
    if ((res.status === 409 || res.status === 422) && attempt === 0) continue;
    throw githubError(res, "put file");
  }
}

/** Delete a file. Returns false if it did not exist. */
export async function deleteFile(path: string, message: string): Promise<boolean> {
  for (let attempt = 0; ; attempt++) {
    const sha = await getSha(path);
    if (!sha) return false;
    const res = await request("DELETE", path, { message, sha });
    if (res.ok) return true;
    if ((res.status === 409 || res.status === 422) && attempt === 0) continue;
    throw githubError(res, "delete file");
  }
}

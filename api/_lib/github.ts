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

/** Tolerate common paste mistakes: quotes, whitespace, URLs, "owner/repo", ".git". */
const clean = (v: string | undefined) =>
  (v ?? "")
    .trim()
    .replace(/^["']+|["']+$/g, "")
    .trim();

function config(): Config {
  const token = clean(process.env.GITHUB_TOKEN);
  const owner =
    clean(process.env.GITHUB_OWNER).split("/").filter(Boolean).pop() ?? "";
  const repo = (
    clean(process.env.GITHUB_REPO).split("/").filter(Boolean).pop() ?? ""
  ).replace(/\.git$/, "");
  if (!token || !owner || !repo) {
    misconfigured("GITHUB_TOKEN, GITHUB_OWNER and GITHUB_REPO must be set");
  }
  return {
    token,
    owner,
    repo,
    branch: clean(process.env.GITHUB_BRANCH) || "main",
  };
}

function authHeaders(c: Config): Record<string, string> {
  return {
    Authorization: `Bearer ${c.token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "portfolio-panel",
  };
}

function assertAllowedPath(path: string): void {
  const segments = path.split("/");
  const ok =
    ALLOWED_PREFIXES.some(
      (prefix) => path.startsWith(prefix) || `${path}/` === prefix,
    ) &&
    /^[A-Za-z0-9._\-/]+$/.test(path) &&
    segments.every((s) => s !== "" && s !== "." && s !== "..");
  if (!ok) throw new HttpError(400, "Invalid file path");
}

async function request(
  method: "GET" | "PUT" | "DELETE",
  path: string,
  body?: Record<string, unknown>,
  accept?: string,
): Promise<Response> {
  assertAllowedPath(path);
  const c = config();
  const encoded = path.split("/").map(encodeURIComponent).join("/");
  const url = new URL(
    `${API}/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}/contents/${encoded}`,
  );
  if (method === "GET") url.searchParams.set("ref", c.branch);
  return fetch(url, {
    method,
    headers: {
      ...authHeaders(c),
      ...(accept ? { Accept: accept } : {}),
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify({ ...body, branch: c.branch }) : undefined,
  });
}

/**
 * GitHub answers 404 (not 403) when a token cannot see a repository, so a bare
 * 404 is ambiguous. Probe the repo and branch to say what is actually wrong.
 * Returns null when repo, access and branch all look fine.
 */
async function diagnoseRepo(): Promise<HttpError | null> {
  const c = config();
  const base = `${API}/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}`;
  const get = (url: string) => fetch(url, { headers: authHeaders(c) });

  const repo = await get(base);
  if (repo.status === 401) {
    return new HttpError(
      502,
      "GitHub rejected GITHUB_TOKEN (invalid, expired or revoked). Create a new token, update it in Vercel and redeploy.",
    );
  }
  if (repo.status === 404) {
    return new HttpError(
      502,
      `Repository "${c.owner}/${c.repo}" was not found or GITHUB_TOKEN cannot access it. Check GITHUB_OWNER and GITHUB_REPO (names only, no URL) and that the token's resource owner is "${c.owner}" and this repository is selected for it.`,
    );
  }
  if (!repo.ok) return null;

  const data = (await repo.json()) as { permissions?: { push?: boolean } };
  if (data.permissions?.push === false) {
    return new HttpError(
      502,
      "GITHUB_TOKEN can read this repository but cannot write to it. Grant Contents: Read and write.",
    );
  }

  const branchPath = c.branch.split("/").map(encodeURIComponent).join("/");
  const branch = await get(`${base}/branches/${branchPath}`);
  if (branch.status === 404) {
    return new HttpError(
      502,
      `Branch "${c.branch}" does not exist in ${c.owner}/${c.repo}. Set GITHUB_BRANCH to an existing branch (main vs master?).`,
    );
  }
  return null;
}

async function githubError(res: Response, action: string): Promise<HttpError> {
  let detail = "";
  try {
    detail = ((await res.clone().json()) as { message?: string }).message ?? "";
  } catch {
    /* non-JSON body */
  }
  console.error(
    `[github] ${action} failed with ${res.status}${detail ? `: ${detail}` : ""}`,
  );

  if (res.status === 404) {
    const diagnosis = await diagnoseRepo().catch(() => null);
    if (diagnosis) {
      console.error(`[github] diagnosis: ${diagnosis.message}`);
      return diagnosis;
    }
    return new HttpError(
      502,
      "GitHub returned 404 although the repository and branch look reachable. Check the Vercel runtime logs for details.",
    );
  }
  if (res.status === 401 || res.status === 403) {
    return new HttpError(
      502,
      "GitHub rejected the request. Check GITHUB_TOKEN permissions (Contents: Read and write) and that it has not expired.",
    );
  }
  if (res.status === 429)
    return new HttpError(503, "GitHub rate limit reached. Try again shortly.");
  if (res.status === 409 || res.status === 422)
    return new HttpError(
      409,
      "The file changed on GitHub while saving. Reload and try again.",
    );
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
  if (!res.ok) throw await githubError(res, "get file");
  const data = (await res.json()) as ContentsFile | unknown[];
  if (Array.isArray(data) || data.type !== "file") return null;
  const content = Buffer.from(
    (data.content ?? "").replace(/\n/g, ""),
    "base64",
  ).toString("utf8");
  return { path: data.path, sha: data.sha, content };
}

/** Raw file bytes (works for binary files and for files over the 1 MB JSON limit). */
export async function getFileBuffer(path: string): Promise<Buffer | null> {
  const res = await request(
    "GET",
    path,
    undefined,
    "application/vnd.github.raw+json",
  );
  if (res.status === 404) return null;
  if (!res.ok) throw await githubError(res, "get file bytes");
  return Buffer.from(await res.arrayBuffer());
}

async function getSha(path: string): Promise<string | null> {
  const res = await request("GET", path);
  if (res.status === 404) return null;
  if (!res.ok) throw await githubError(res, "get sha");
  const data = (await res.json()) as { sha?: string };
  return data.sha ?? null;
}

export interface DirEntry {
  name: string;
  path: string;
  sha: string;
  size: number;
}

/** Files directly inside a folder. A folder that does not exist yet is just empty. */
export async function listDir(path: string): Promise<DirEntry[]> {
  const res = await request("GET", path);
  if (res.status === 404) {
    // Folder not created yet is fine, but a wrong repo/branch/token must not look like "no posts".
    const problem = await diagnoseRepo().catch(() => null);
    if (problem) throw problem;
    return [];
  }
  if (!res.ok) throw await githubError(res, "list directory");
  const data = (await res.json()) as Array<{
    type: string;
    name: string;
    path: string;
    sha: string;
    size?: number;
  }>;
  if (!Array.isArray(data)) return [];
  return data
    .filter((e) => e.type === "file")
    .map(({ name, path: p, sha, size }) => ({
      name,
      path: p,
      sha,
      size: size ?? 0,
    }));
}

/**
 * Create or update a file. If it already exists its blob sha is looked up
 * automatically (GitHub requires it), with one retry if someone else
 * committed in between.
 */
export async function putFile(
  path: string,
  content: string | Buffer,
  message: string,
): Promise<void> {
  const base64 = Buffer.isBuffer(content)
    ? content.toString("base64")
    : Buffer.from(content, "utf8").toString("base64");
  for (let attempt = 0; ; attempt++) {
    const sha = await getSha(path);
    const res = await request("PUT", path, {
      message,
      content: base64,
      ...(sha ? { sha } : {}),
    });
    if (res.ok) return;
    if ((res.status === 409 || res.status === 422) && attempt === 0) continue;
    throw await githubError(res, "put file");
  }
}

/** Delete a file. Returns false if it did not exist. */
export async function deleteFile(
  path: string,
  message: string,
): Promise<boolean> {
  for (let attempt = 0; ; attempt++) {
    const sha = await getSha(path);
    if (!sha) return false;
    const res = await request("DELETE", path, { message, sha });
    if (res.ok) return true;
    if ((res.status === 409 || res.status === 422) && attempt === 0) continue;
    throw await githubError(res, "delete file");
  }
}

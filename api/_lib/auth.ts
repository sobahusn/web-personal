import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { HttpError, misconfigured } from "./http.js";

const COOKIE = "panel_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function sha256(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

/** Constant-time string comparison (hashing first hides length differences). */
export function safeEqual(a: string, b: string): boolean {
  return timingSafeEqual(sha256(a), sha256(b));
}

function adminPassword(): string {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) misconfigured("ADMIN_PASSWORD is not set");
  return pw;
}

/**
 * Signing key = SESSION_SECRET + hash of the password, so changing
 * ADMIN_PASSWORD instantly invalidates every existing session.
 */
function signingKey(): Buffer {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) misconfigured("SESSION_SECRET must be at least 32 characters");
  return createHmac("sha256", secret).update(sha256(adminPassword())).digest();
}

function sign(payload: string): string {
  return createHmac("sha256", signingKey()).update(payload).digest("base64url");
}

export function createSessionToken(now = Date.now()): string {
  const payload = Buffer.from(JSON.stringify({ exp: now + MAX_AGE_SECONDS * 1000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined, now = Date.now()): boolean {
  if (!token) return false;
  const [payload, signature, ...rest] = token.split(".");
  if (!payload || !signature || rest.length) return false;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp?: unknown };
    return typeof exp === "number" && exp > now;
  } catch {
    return false;
  }
}

export function verifyPassword(input: unknown): boolean {
  return typeof input === "string" && input.length > 0 && safeEqual(input, adminPassword());
}

function readCookie(req: VercelRequest, name: string): string | undefined {
  const raw = req.headers.cookie;
  if (!raw) return undefined;
  for (const part of raw.split(";")) {
    const i = part.indexOf("=");
    if (i < 0 || part.slice(0, i).trim() !== name) continue;
    try {
      return decodeURIComponent(part.slice(i + 1).trim());
    } catch {
      return undefined;
    }
  }
  return undefined;
}

export function isAdmin(req: VercelRequest): boolean {
  return verifySessionToken(readCookie(req, COOKIE));
}

function cookieAttributes(maxAge: number): string {
  // `vercel dev` runs on plain http://localhost; everywhere else require HTTPS.
  const secure = process.env.VERCEL_ENV === "development" ? "" : "; Secure";
  return `Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}

export function setSessionCookie(res: VercelResponse): void {
  res.setHeader("Set-Cookie", `${COOKIE}=${encodeURIComponent(createSessionToken())}; ${cookieAttributes(MAX_AGE_SECONDS)}`);
}

export function clearSessionCookie(res: VercelResponse): void {
  res.setHeader("Set-Cookie", `${COOKIE}=; ${cookieAttributes(0)}`);
}

/** Defence in depth on top of SameSite=Strict: reject cross-origin browser requests. */
function assertSameOrigin(req: VercelRequest): void {
  const origin = req.headers.origin;
  if (!origin) return; // non-browser clients and same-origin GETs
  const forwarded = req.headers["x-forwarded-host"];
  const host = (Array.isArray(forwarded) ? forwarded[0] : forwarded ?? req.headers.host ?? "").split(",")[0].trim();
  let originHost = "";
  try {
    originHost = new URL(origin).host;
  } catch {
    /* fall through */
  }
  if (!originHost || originHost !== host) throw new HttpError(403, "Cross-origin request blocked");
}

/** Throws 401 unless the request carries a valid session. Pass mutating for writes. */
export function requireAdmin(req: VercelRequest, opts: { mutating?: boolean } = {}): void {
  if (opts.mutating) assertSameOrigin(req);
  if (!isAdmin(req)) throw new HttpError(401, "Not authenticated");
}

/* ---- Best-effort login throttling (in-memory: per warm serverless instance) ---- */

const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

export function clientIp(req: VercelRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  const first = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(",")[0]?.trim();
  return first || (req.headers["x-real-ip"] as string | undefined) || "unknown";
}

export function assertNotThrottled(ip: string, now = Date.now()): void {
  const entry = attempts.get(ip);
  if (entry && entry.resetAt > now && entry.count >= MAX_ATTEMPTS) {
    throw new HttpError(429, "Too many attempts. Try again in a few minutes.");
  }
}

export function recordFailure(ip: string, now = Date.now()): void {
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt <= now) attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  else entry.count += 1;
}

export function clearFailures(ip: string): void {
  attempts.delete(ip);
}

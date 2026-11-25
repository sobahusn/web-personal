import type { VercelRequest, VercelResponse } from "@vercel/node";

export class HttpError extends Error {
  status: number;
  /** Extra JSON fields merged into the error response (e.g. which posts use an image). */
  details?: Record<string, unknown>;
  constructor(
    status: number,
    message: string,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.details = details;
  }
}

export type Handler = (
  req: VercelRequest,
  res: VercelResponse,
) => Promise<void> | void;
type Method = "GET" | "POST" | "PUT" | "DELETE";

export function send(res: VercelResponse, status: number, body: unknown): void {
  res.status(status).json(body);
}

/** Never let a CDN or browser cache admin/auth responses. */
export function noStore(res: VercelResponse): void {
  res.setHeader("Cache-Control", "private, no-store");
}

/** Public, CDN-cacheable for a minute, then served stale while revalidating. */
export function cachePublic(res: VercelResponse): void {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=300",
  );
}

export function queryString(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Log the real reason, tell the client nothing useful to an attacker. */
export function misconfigured(reason: string): never {
  console.error(`[config] ${reason}`);
  throw new HttpError(500, "Server is not configured");
}

/**
 * Dispatch by HTTP method, return 405 for the rest, and turn thrown
 * HttpErrors into JSON responses. Unknown errors become a generic 500.
 */
export function route(handlers: Partial<Record<Method, Handler>>): Handler {
  return async (req, res) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    const handler = handlers[req.method as Method];
    if (!handler) {
      res.setHeader("Allow", Object.keys(handlers).join(", "));
      return send(res, 405, { error: "Method not allowed" });
    }
    try {
      await handler(req, res);
    } catch (err) {
      if (err instanceof HttpError)
        return send(res, err.status, { ...err.details, error: err.message });
      console.error(err);
      return send(res, 500, { error: "Internal server error" });
    }
  };
}

import { requireAdmin } from "./_lib/auth.js";
import { HttpError, noStore, route, send } from "./_lib/http.js";
import { putFile } from "./_lib/github.js";
import { detectImageExtension, sanitizeFilename } from "./_lib/validate.js";

// Vercel rejects request bodies over 4.5 MB; base64 adds ~33%, so keep images small.
// The editor resizes and converts to WebP in the browser before sending.
const MAX_BYTES = 3 * 1024 * 1024;

export default route({
  POST: async (req, res) => {
    requireAdmin(req, { mutating: true });
    noStore(res);

    const body = (req.body ?? {}) as { filename?: unknown; data?: unknown };
    if (typeof body.data !== "string" || !body.data) throw new HttpError(400, "Missing image data");
    if (body.data.length > Math.ceil((MAX_BYTES * 4) / 3) + 8) throw new HttpError(413, "Image is too large (max 3 MB)");

    const buffer = Buffer.from(body.data, "base64");
    if (buffer.length > MAX_BYTES) throw new HttpError(413, "Image is too large (max 3 MB)");

    const ext = detectImageExtension(buffer);
    if (!ext) throw new HttpError(400, "Unsupported image. Use PNG, JPEG, WebP, GIF or AVIF.");

    const name = `${Date.now()}-${sanitizeFilename(body.filename)}.${ext}`;
    await putFile(`public/images/blog/${name}`, buffer, `asset: upload ${name}`);
    send(res, 201, { path: `/images/blog/${name}` });
  },
});

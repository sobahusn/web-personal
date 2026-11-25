import { requireAdmin } from "../_lib/auth.js";
import { getFileBuffer } from "../_lib/github.js";
import { HttpError, queryString, route } from "../_lib/http.js";
import { MEDIA_DIR, assertMediaName, contentTypeFor } from "../_lib/media.js";

/**
 * Admin-only image proxy. Images committed through the panel are not on the site
 * until Vercel redeploys, so the editor and media library read them from GitHub
 * through here and can show them immediately.
 */
export default route({
  GET: async (req, res) => {
    requireAdmin(req);
    const name = assertMediaName(queryString(req.query.name));
    const bytes = await getFileBuffer(`${MEDIA_DIR}/${name}`);
    if (!bytes) throw new HttpError(404, "Image not found");

    res.setHeader("Content-Type", contentTypeFor(name));
    res.setHeader("Cache-Control", "private, max-age=3600"); // admin-only, never shared by a CDN
    res.setHeader("Content-Security-Policy", "default-src 'none'; sandbox");
    res.status(200).send(bytes);
  },
});

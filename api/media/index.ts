import { requireAdmin } from "../_lib/auth.js";
import { deleteFile, listDir } from "../_lib/github.js";
import { HttpError, noStore, queryString, route, send } from "../_lib/http.js";
import { MEDIA_DIR, assertMediaName, isMediaName, mediaUsage, uploadedAt } from "../_lib/media.js";
import type { MediaFile } from "../../src/types/blog.js";

export default route({
  // Admin only: every image in public/images/blog with the posts that use it.
  GET: async (req, res) => {
    requireAdmin(req);
    noStore(res);
    const [entries, usage] = await Promise.all([listDir(MEDIA_DIR), mediaUsage()]);
    const files: MediaFile[] = entries
      .filter((e) => isMediaName(e.name))
      .map((e) => ({
        name: e.name,
        path: `/images/blog/${e.name}`,
        size: e.size,
        uploadedAt: uploadedAt(e.name),
        usedBy: usage.get(e.name) ?? [],
      }))
      .sort((a, b) => (b.uploadedAt ?? "").localeCompare(a.uploadedAt ?? "") || a.name.localeCompare(b.name));
    send(res, 200, { files });
  },

  // ?name=<file>[&force=1]. Refuses with 409 + usedBy while any post references the image.
  DELETE: async (req, res) => {
    requireAdmin(req, { mutating: true });
    noStore(res);
    const name = assertMediaName(queryString(req.query.name));
    const force = ["1", "true"].includes(queryString(req.query.force) ?? "");

    if (!force) {
      const usedBy = (await mediaUsage()).get(name) ?? [];
      if (usedBy.length) {
        throw new HttpError(
          409,
          `This image is used by ${usedBy.length} article${usedBy.length === 1 ? "" : "s"}. Remove it from them first, or delete anyway.`,
          { usedBy },
        );
      }
    }

    if (!(await deleteFile(`${MEDIA_DIR}/${name}`, `asset: delete ${name}`))) throw new HttpError(404, "Image not found");
    send(res, 200, { ok: true });
  },
});

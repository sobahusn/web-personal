import { requireAdmin } from "../_lib/auth.js";
import {
  HttpError,
  cachePublic,
  noStore,
  queryString,
  route,
  send,
} from "../_lib/http.js";
import {
  contentChanged,
  getPost,
  postExists,
  removePost,
  savePost,
} from "../_lib/posts.js";
import {
  assertSlug,
  readSaveOptions,
  validatePostInput,
} from "../_lib/validate.js";

export default route({
  // Public: published posts only (CDN-cached). ?scope=admin: drafts too, requires a session.
  GET: async (req, res) => {
    const slug = assertSlug(queryString(req.query.slug));
    const admin = queryString(req.query.scope) === "admin";
    if (admin) requireAdmin(req);

    const post = await getPost(slug);
    if (!post || (!admin && !post.published))
      throw new HttpError(404, "Article not found");

    if (admin) noStore(res);
    else cachePublic(res);
    send(res, 200, { post });
  },

  PUT: async (req, res) => {
    requireAdmin(req, { mutating: true });
    noStore(res);
    const oldSlug = assertSlug(queryString(req.query.slug));
    const input = validatePostInput(req.body);
    const { commitMessage, clientDate } = readSaveOptions(req.body);

    const existing = await getPost(oldSlug);
    if (!existing) throw new HttpError(404, "Article not found");

    const renamed = input.slug !== oldSlug;
    if (renamed && (await postExists(input.slug)))
      throw new HttpError(409, "An article with this slug already exists");

    // `updated` is server-controlled: bump it only when something a reader sees changed.
    const updated = contentChanged(existing, input)
      ? (clientDate ?? new Date().toISOString().slice(0, 10))
      : existing.updated;

    const verb = input.published ? "publish" : "draft";
    const post = await savePost(
      input,
      commitMessage ??
        `content: ${renamed ? "rename" : "update"} ${verb} ${input.slug}`,
      updated,
    );
    if (renamed) await removePost(oldSlug);

    send(res, 200, { post });
  },

  DELETE: async (req, res) => {
    requireAdmin(req, { mutating: true });
    noStore(res);
    const slug = assertSlug(queryString(req.query.slug));
    if (!(await removePost(slug)))
      throw new HttpError(404, "Article not found");
    send(res, 200, { ok: true });
  },
});

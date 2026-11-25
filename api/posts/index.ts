import { requireAdmin } from "../_lib/auth.js";
import {
  HttpError,
  cachePublic,
  noStore,
  queryString,
  route,
  send,
} from "../_lib/http.js";
import { listPosts, postExists, savePost, toMeta } from "../_lib/posts.js";
import { readSaveOptions, validatePostInput } from "../_lib/validate.js";

export default route({
  // Public: published posts only (CDN-cached). ?scope=admin: everything, requires a session.
  GET: async (req, res) => {
    if (queryString(req.query.scope) === "admin") {
      requireAdmin(req);
      noStore(res);
      return send(res, 200, { posts: await listPosts() });
    }
    const posts = (await listPosts()).filter((p) => p.published);
    cachePublic(res);
    send(res, 200, { posts });
  },

  POST: async (req, res) => {
    requireAdmin(req, { mutating: true });
    noStore(res);
    const input = validatePostInput(req.body);
    const { commitMessage } = readSaveOptions(req.body);
    if (await postExists(input.slug))
      throw new HttpError(409, "An article with this slug already exists");
    // A brand-new post has no "last updated" yet, so `updated` stays empty.
    const post = await savePost(
      input,
      commitMessage ??
        `content: ${input.published ? "publish" : "draft"} ${input.slug}`,
    );
    send(res, 201, { post: toMeta(post) });
  },
});

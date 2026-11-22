import type { VercelRequest, VercelResponse } from "@vercel/node";
import { SLUG_RE } from "./_lib/validate.js";
import { getPost } from "./_lib/posts.js";
import { queryString } from "./_lib/http.js";

/**
 * Link-preview shim. vercel.json rewrites /articles/:slug here ONLY for social
 * crawlers (Facebook, X, Slack, WhatsApp, LinkedIn, ...), which don't run
 * JavaScript and would otherwise see the generic SPA <head>. Real visitors and
 * search engines get the normal app.
 */
const esc = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  res.setHeader("X-Content-Type-Options", "nosniff");
  const slug = queryString(req.query.slug);
  if (req.method !== "GET" || !slug || !SLUG_RE.test(slug)) {
    res.status(404).send("Not found");
    return;
  }

  let post;
  try {
    post = await getPost(slug);
  } catch (err) {
    console.error(err);
    res.status(502).send("Unavailable");
    return;
  }
  if (!post || !post.published) {
    res.status(404).send("Not found");
    return;
  }

  const forwarded = req.headers["x-forwarded-host"];
  const host = (Array.isArray(forwarded) ? forwarded[0] : forwarded ?? req.headers.host ?? "").split(",")[0].trim();
  const origin = `https://${host}`;
  const url = `${origin}/articles/${post.slug}`;
  const image = post.coverImage ? (post.coverImage.startsWith("/") ? origin + post.coverImage : post.coverImage) : "";
  const title = esc(post.title);
  const description = esc(post.excerpt);

  const html = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<title>${title} | Sobahusn</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Sobahusn">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${esc(url)}">
${image ? `<meta property="og:image" content="${esc(image)}">` : ""}
<meta property="article:published_time" content="${esc(post.date)}">
${post.tags.map((t) => `<meta property="article:tag" content="${esc(t)}">`).join("\n")}
<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
${image ? `<meta name="twitter:image" content="${esc(image)}">` : ""}
</head><body>
<h1>${title}</h1>
<p>${description}</p>
<p><a href="${esc(url)}">Read the article</a></p>
</body></html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
  res.status(200).send(html);
}

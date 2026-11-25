import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, {
  defaultSchema,
  type Options as SanitizeSchema,
} from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import type { Options as RemarkRehypeOptions } from "remark-rehype";
import type { PluggableList } from "unified";

/**
 * Article rendering pipeline.
 *
 * Articles may contain a small, fixed set of HTML for layout that Markdown
 * cannot express:
 *
 *   <div align="center" data-indent="2"> ...markdown, blank lines around... </div>
 *   <ins>underlined</ins>
 *
 * Raw HTML is parsed (rehype-raw) and then everything not on the allowlist
 * below is removed (rehype-sanitize). There is no `style`, no `class`
 * (except what the Markdown pipeline itself emits), no event handlers, no
 * scripts/iframes/SVG, and no javascript: or data: URLs.
 */

export const ALIGN_VALUES = ["left", "center", "right", "justify"] as const;
export const INDENT_LEVELS = ["1", "2", "3", "4"] as const;

const align = ["align", ...ALIGN_VALUES] as [string, ...string[]];
const indent = ["dataIndent", ...INDENT_LEVELS] as [string, ...string[]];

const base = defaultSchema.attributes ?? {};

// The default schema allows `align` (any value), author-supplied `id`/`name`,
// `tabIndex` and `accessKey` on every element. Drop those and re-add `align`
// with exact values on specific tags only.
const globals = (base["*"] ?? []).filter(
  (attr) =>
    !["align", "id", "name", "tabIndex", "accessKey"].includes(String(attr)),
);

export const sanitizeSchema: SanitizeSchema = {
  ...defaultSchema,
  // Only ids that GFM footnotes generate are kept: `user-content-*` plus the
  // heading `footnote-label` that their aria-describedby points at. Sanitize must
  // not prefix them a second time.
  clobber: [],
  clobberPrefix: "",
  tagNames: Array.from(
    new Set([...(defaultSchema.tagNames ?? []), "div", "ins"]),
  ),
  attributes: {
    ...base,
    "*": [...globals, ["id", /^(?:user-content-.+|footnote-label)$/]],
    div: [...(base.div ?? []), align, indent],
    p: [...(base.p ?? []), align],
    h1: [...(base.h1 ?? []), align],
    h2: [...(base.h2 ?? []), align],
    h3: [...(base.h3 ?? []), align],
    h4: [...(base.h4 ?? []), align],
    h5: [...(base.h5 ?? []), align],
    h6: [...(base.h6 ?? []), align],
    img: [...(base.img ?? []), align],
  },
};

export const remarkPlugins: PluggableList = [remarkGfm];

/** Lets raw HTML nodes through remark-rehype so rehype-raw can parse them. */
export const remarkRehypeOptions: RemarkRehypeOptions = {
  allowDangerousHtml: true,
};

/**
 * Order matters:
 *  1. raw      parse embedded HTML into the tree
 *  2. sanitize strip everything outside the allowlist
 *  3. slug     add heading ids (after sanitize, which removes author ids)
 *  4. highlight adds hljs classes (after sanitize, which would strip them)
 */
export const rehypePlugins: PluggableList = [
  rehypeRaw,
  [rehypeSanitize, sanitizeSchema],
  rehypeSlug,
  [rehypeHighlight, { detect: false, ignoreMissing: true }],
];

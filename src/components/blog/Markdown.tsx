import { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import { Link } from "react-router-dom";
import "highlight.js/styles/github-dark.css";
import { cn } from "../../lib/utils";
import {
  rehypePlugins,
  remarkPlugins,
  remarkRehypeOptions,
} from "../../lib/markdown";

interface MarkdownProps {
  children: string;
  className?: string;
  /**
   * Maps an image src to a displayable URL. The editor uses this to preview
   * freshly uploaded images (blob: URLs) before the deployed site has them.
   */
  resolveSrc?: (src: string) => string;
}

/**
 * Renders article Markdown. A small HTML allowlist (align, data-indent, <ins>)
 * is supported; everything else is stripped. See src/lib/markdown.ts.
 */
export const Markdown = memo(function Markdown({
  children,
  className,
  resolveSrc,
}: MarkdownProps) {
  const components: Components = {
    img: ({ src, alt }) => (
      <img
        src={typeof src === "string" ? (resolveSrc?.(src) ?? src) : undefined}
        alt={alt ?? ""}
        loading="lazy"
        decoding="async"
        className="mx-auto h-auto max-w-full rounded-xl"
      />
    ),
    a: ({ href, children: label }) => {
      if (href?.startsWith("/") && !href.startsWith("//"))
        return <Link to={href}>{label}</Link>;
      const external = /^https?:\/\//i.test(href ?? "");
      return (
        <a
          href={href}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {label}
        </a>
      );
    },
  };

  return (
    <div
      className={cn("prose prose-theme max-w-none prose-img:my-6", className)}
    >
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        remarkRehypeOptions={remarkRehypeOptions}
        rehypePlugins={rehypePlugins}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
});

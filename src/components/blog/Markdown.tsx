import { memo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Link } from "react-router-dom";
import "highlight.js/styles/github-dark.css";
import { cn } from "../../lib/utils";

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
 * Raw HTML in markdown is NOT rendered (no rehype-raw), and react-markdown
 * strips unsafe URL protocols such as javascript:, so article content cannot
 * inject scripts.
 */
export const Markdown = memo(function Markdown({ children, className, resolveSrc }: MarkdownProps) {
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
      if (href?.startsWith("/") && !href.startsWith("//")) return <Link to={href}>{label}</Link>;
      const external = /^https?:\/\//i.test(href ?? "");
      return (
        <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {label}
        </a>
      );
    },
  };

  return (
    <div className={cn("prose prose-theme max-w-none prose-img:my-6", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { detect: false, ignoreMissing: true }]]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
});

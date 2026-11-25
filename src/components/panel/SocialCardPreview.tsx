import { ImageOff } from "lucide-react";

interface Props {
  title: string;
  excerpt: string;
  /** Displayable cover URL ("" when none) */
  image: string;
  host: string;
}

const TITLE_LIMIT = 60;
const EXCERPT_LIMIT = 160;

/** Approximate large link card as shown when the article is shared (and the hints search engines give). */
export function SocialCardPreview({ title, excerpt, image, host }: Props) {
  const hints: string[] = [];
  if (!image) hints.push("Add a cover image to get a large preview card.");
  if (title.length > TITLE_LIMIT) hints.push(`Title is ${title.length} characters. Over ${TITLE_LIMIT} may be cut off.`);
  if (excerpt.length > EXCERPT_LIMIT) hints.push(`Summary is ${excerpt.length} characters. Over ${EXCERPT_LIMIT} may be cut off.`);
  if (!excerpt.trim()) hints.push("Add a summary. It is used as the link description.");

  return (
    <div aria-label="Link preview">
      <p className="mb-1.5 text-xs font-medium text-muted">Link preview</p>
      <div className="overflow-hidden rounded-xl border border-theme bg-card">
        {image ? (
          <img src={image} alt="" className="aspect-[1.91/1] w-full object-cover" />
        ) : (
          <div className="flex aspect-[1.91/1] w-full items-center justify-center bg-theme text-muted">
            <ImageOff size={22} aria-hidden />
          </div>
        )}
        <div className="space-y-0.5 border-t border-theme p-3">
          <p className="truncate text-[11px] uppercase tracking-wide text-muted">{host}</p>
          <p className="line-clamp-2 text-sm font-semibold leading-snug text-theme">{title.trim() || "Article title"}</p>
          <p className="line-clamp-2 text-xs leading-snug text-muted">{excerpt.trim() || "The summary appears here."}</p>
        </div>
      </div>
      {hints.length > 0 && (
        <ul className="mt-2 space-y-0.5 text-xs text-muted">
          {hints.map((hint) => (
            <li key={hint}>{hint}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

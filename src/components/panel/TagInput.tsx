import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { inputClass } from "./ui";

const MAX_TAGS = 10;

export function TagInput({ value, onChange, id }: { value: string[]; onChange: (tags: string[]) => void; id?: string }) {
  const [draft, setDraft] = useState("");

  function commit(raw: string) {
    const parts = raw.split(",").map((t) => t.trim()).filter(Boolean);
    if (!parts.length) return;
    const next = [...value];
    for (const part of parts) {
      if (next.length < MAX_TAGS && !next.some((t) => t.toLowerCase() === part.toLowerCase())) next.push(part.slice(0, 32));
    }
    onChange(next);
    setDraft("");
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit(draft);
    } else if (e.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div>
      {value.length > 0 && (
        <ul className="mb-2 flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <li key={tag} className="flex items-center gap-1 rounded-lg bg-card py-1 pl-2.5 pr-1 text-xs font-medium text-theme ring-1 ring-[color:var(--border)]">
              {tag}
              <button
                type="button"
                onClick={() => onChange(value.filter((t) => t !== tag))}
                aria-label={`Remove tag ${tag}`}
                className="flex h-5 w-5 items-center justify-center rounded text-muted hover:text-theme"
              >
                <X size={12} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <input
        id={id}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => commit(draft)}
        disabled={value.length >= MAX_TAGS}
        placeholder={value.length >= MAX_TAGS ? "Tag limit reached" : "Add a tag, then press Enter"}
        className={inputClass}
      />
    </div>
  );
}

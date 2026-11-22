import { useDeferredValue, useEffect, useRef, useState, type ClipboardEvent, type DragEvent, type KeyboardEvent, type ReactNode } from "react";
import { Bold, Code, Heading2, Heading3, Image as ImageIcon, Italic, Link2, List, ListOrdered, Loader2, Minus, Quote, SquareCode } from "lucide-react";
import { Markdown } from "../blog/Markdown";
import { errorMessage } from "../../lib/api";

interface Props {
  value: string;
  onChange: (value: string) => void;
  /** Uploads one image and resolves to its public path (/images/blog/...) */
  upload: (file: File) => Promise<string>;
  resolveSrc: (src: string) => string;
}

function ToolbarButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      // keep focus and selection in the textarea when clicking the toolbar
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-theme hover:text-theme"
    >
      {children}
    </button>
  );
}

const altFromFilename = (name: string) => name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").replace(/[[\]]/g, "").trim() || "image";

export function MarkdownEditor({ value, onChange, upload, resolveSrc }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const valueRef = useRef(value);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState("");
  const previewSource = useDeferredValue(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  /**
   * Replace a range through the browser's own edit pipeline so Ctrl+Z keeps
   * working; fall back to setRangeText where execCommand is unavailable.
   */
  function replace(start: number, end: number, text: string, selectStart: number, selectEnd: number) {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.focus();
    ta.setSelectionRange(start, end);
    if (!document.execCommand("insertText", false, text)) {
      ta.setRangeText(text, start, end, "end");
      onChange(ta.value);
    }
    ta.setSelectionRange(selectStart, selectEnd);
  }

  function wrap(before: string, after: string, placeholder: string) {
    const ta = textareaRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e, value: v } = ta;
    const selected = v.slice(s, e) || placeholder;
    replace(s, e, before + selected + after, s + before.length, s + before.length + selected.length);
  }

  /** Toggle a prefix on every selected line (headings, quotes, lists). */
  function toggleLines(prefixFor: (index: number) => string, strip?: RegExp) {
    const ta = textareaRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e, value: v } = ta;
    const start = v.lastIndexOf("\n", s - 1) + 1;
    const found = v.indexOf("\n", e);
    const end = found === -1 ? v.length : found;
    const block = v.slice(start, end);
    const lines = block.split("\n");
    const allPrefixed = lines.every((line, i) => line.startsWith(prefixFor(i)));
    const next = lines
      .map((line, i) => (allPrefixed ? line.slice(prefixFor(i).length) : prefixFor(i) + (strip ? line.replace(strip, "") : line)))
      .join("\n");
    if (s === e) {
      // Plain caret: keep typing where you were, just shifted by the prefix change.
      const caret = Math.max(start, s + next.length - block.length);
      replace(start, end, next, caret, caret);
    } else {
      replace(start, end, next, start, start + next.length);
    }
  }

  function link() {
    const ta = textareaRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e, value: v } = ta;
    const text = v.slice(s, e) || "link text";
    const urlStart = s + text.length + 3;
    replace(s, e, `[${text}](https://)`, urlStart, urlStart + 8);
  }

  function codeBlock() {
    const ta = textareaRef.current;
    if (!ta) return;
    const lead = ta.selectionStart > 0 && ta.value[ta.selectionStart - 1] !== "\n" ? "\n" : "";
    wrap(`${lead}\`\`\`ts\n`, "\n```\n", "code");
  }

  function rule() {
    const ta = textareaRef.current;
    if (!ta) return;
    const at = ta.selectionEnd;
    const text = "\n\n---\n\n";
    replace(at, at, text, at + text.length, at + text.length);
  }

  async function insertImages(files: File[]) {
    const images = files.filter((f) => f.type.startsWith("image/"));
    if (!images.length) return;
    setError("");
    for (const file of images) {
      const token = `![Uploading ${file.name}](uploading-${Math.random().toString(36).slice(2)})`;
      const ta = textareaRef.current;
      if (ta) {
        const at = ta.selectionEnd;
        const text = `\n${token}\n`;
        replace(at, at, text, at + text.length, at + text.length);
      }
      setUploading((n) => n + 1);
      try {
        const path = await upload(file);
        const markdown = `![${altFromFilename(file.name)}](${path})`;
        onChange(valueRef.current.replace(token, () => markdown));
      } catch (err) {
        onChange(valueRef.current.replace(`\n${token}\n`, () => ""));
        setError(errorMessage(err));
      } finally {
        setUploading((n) => n - 1);
      }
    }
  }

  const hasFiles = (e: DragEvent) => Array.from(e.dataTransfer.types).includes("Files");

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (!(e.ctrlKey || e.metaKey) || e.shiftKey || e.altKey) return;
    const actions: Record<string, () => void> = {
      b: () => wrap("**", "**", "bold text"),
      i: () => wrap("*", "*", "italic text"),
      k: link,
    };
    const action = actions[e.key.toLowerCase()];
    if (action) {
      e.preventDefault();
      action();
    }
  }

  function onPaste(e: ClipboardEvent) {
    const files = Array.from(e.clipboardData.files).filter((f) => f.type.startsWith("image/"));
    if (files.length) {
      e.preventDefault();
      void insertImages(files);
    }
  }

  const paneVisibility = (pane: "write" | "preview") => (tab === pane ? "block" : "hidden md:block");

  return (
    <div className="overflow-hidden rounded-2xl border border-theme bg-card">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-theme px-2 py-1.5" role="toolbar" aria-label="Formatting">
        <ToolbarButton label="Heading 2" onClick={() => toggleLines(() => "## ", /^#{1,6}\s+/)}>
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton label="Heading 3" onClick={() => toggleLines(() => "### ", /^#{1,6}\s+/)}>
          <Heading3 size={16} />
        </ToolbarButton>
        <span className="mx-1 h-5 w-px bg-[color:var(--border)]" aria-hidden />
        <ToolbarButton label="Bold (Ctrl+B)" onClick={() => wrap("**", "**", "bold text")}>
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton label="Italic (Ctrl+I)" onClick={() => wrap("*", "*", "italic text")}>
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton label="Link (Ctrl+K)" onClick={link}>
          <Link2 size={16} />
        </ToolbarButton>
        <span className="mx-1 h-5 w-px bg-[color:var(--border)]" aria-hidden />
        <ToolbarButton label="Inline code" onClick={() => wrap("`", "`", "code")}>
          <Code size={16} />
        </ToolbarButton>
        <ToolbarButton label="Code block" onClick={codeBlock}>
          <SquareCode size={16} />
        </ToolbarButton>
        <ToolbarButton label="Quote" onClick={() => toggleLines(() => "> ")}>
          <Quote size={16} />
        </ToolbarButton>
        <ToolbarButton label="Bulleted list" onClick={() => toggleLines(() => "- ")}>
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton label="Numbered list" onClick={() => toggleLines((i) => `${i + 1}. `)}>
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton label="Divider" onClick={rule}>
          <Minus size={16} />
        </ToolbarButton>
        <ToolbarButton label="Insert image" onClick={() => fileInputRef.current?.click()}>
          <ImageIcon size={16} />
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
          multiple
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => {
            void insertImages(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />

        {uploading > 0 && (
          <span className="ml-auto flex items-center gap-1.5 px-2 text-xs text-muted" role="status">
            <Loader2 size={12} className="animate-spin" />
            Uploading {uploading > 1 ? `${uploading} images` : "image"}…
          </span>
        )}

        <div className="ml-auto flex rounded-lg border border-theme p-0.5 text-xs font-medium md:hidden" role="tablist">
          {(["write", "preview"] as const).map((name) => (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={tab === name}
              onClick={() => setTab(name)}
              className={`rounded-md px-3 py-1 capitalize ${tab === name ? "bg-accent text-white" : "text-muted"}`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p role="alert" className="border-b border-theme bg-red-500/5 px-4 py-2 text-xs text-red-500">
          {error}
        </p>
      )}

      <div className="grid md:grid-cols-2 md:divide-x md:divide-[color:var(--border)]">
        <div className={`relative ${paneVisibility("write")}`}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
            onDragOver={(e) => {
              if (hasFiles(e)) {
                e.preventDefault();
                setDragging(true);
              }
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              if (!hasFiles(e)) return;
              e.preventDefault();
              setDragging(false);
              void insertImages(Array.from(e.dataTransfer.files));
            }}
            spellCheck
            aria-label="Article body (Markdown)"
            placeholder={"Write in Markdown. Drop or paste images to upload them."}
            className="block h-[70vh] min-h-[420px] w-full resize-none bg-transparent p-5 font-mono text-sm leading-relaxed text-theme placeholder:text-muted focus:outline-none"
          />
          {dragging && (
            <div className="pointer-events-none absolute inset-2 flex items-center justify-center rounded-xl border-2 border-dashed border-accent bg-[color-mix(in_srgb,var(--card-bg)_85%,transparent)] text-sm font-medium text-theme">
              Drop to upload
            </div>
          )}
        </div>

        <div className={`h-[70vh] min-h-[420px] overflow-y-auto p-5 ${paneVisibility("preview")}`} aria-label="Preview">
          {previewSource.trim() ? (
            <Markdown resolveSrc={resolveSrc}>{previewSource}</Markdown>
          ) : (
            <p className="text-sm text-muted">The preview appears here as you write.</p>
          )}
        </div>
      </div>
    </div>
  );
}

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { errorMessage } from "../../lib/api";
import { inputClass } from "./ui";

interface Props {
  value: string;
  onChange: (value: string) => void;
  upload: (file: File) => Promise<string>;
  resolveSrc: (src: string) => string;
}

export function ImageUploader({ value, onChange, upload, resolveSrc }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  async function handle(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      onChange(await upload(file));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      {value && (
        <img src={resolveSrc(value)} alt="Cover preview" className="aspect-video w-full rounded-xl border border-theme object-cover" />
      )}

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void handle(e.dataTransfer.files[0]);
        }}
        className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-4 text-sm transition-colors focus-within:border-accent ${
          dragging ? "border-accent bg-card text-theme" : "border-theme text-muted hover:border-accent hover:text-theme"
        }`}
      >
        {busy ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
        {busy ? "Uploading…" : value ? "Replace image" : "Drop an image or click to upload"}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
          className="sr-only"
          disabled={busy}
          onChange={(e) => {
            void handle(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </label>

      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value.trim())}
          placeholder="/images/blog/… or https://…"
          aria-label="Cover image path or URL"
          className={inputClass}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Remove cover image"
            title="Remove cover image"
            className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl border border-theme text-muted transition-colors hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {error && (
        <p role="alert" className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

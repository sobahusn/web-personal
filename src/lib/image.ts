const MAX_WIDTH = 1600;
const MAX_BYTES = 3 * 1024 * 1024; // keep in sync with api/upload.ts

export interface PreparedImage {
  filename: string;
  /** base64 without the data: prefix */
  base64: string;
  /** blob: URL so the editor can preview the image before the site redeploys */
  previewUrl: string;
}

function toBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(new Error("Could not read the image file"));
    reader.readAsDataURL(blob);
  });
}

/**
 * Downscale to 1600px wide and re-encode as WebP (typically 5-10x smaller).
 * GIFs are sent untouched so animation survives. Falls back to the original
 * file whenever re-encoding would make it bigger or is not possible.
 */
export async function prepareImage(file: File): Promise<PreparedImage> {
  if (!file.type.startsWith("image/")) throw new Error(`${file.name} is not an image`);

  let blob: Blob = file;
  let filename = file.name;

  if (file.type !== "image/gif") {
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, MAX_WIDTH / bitmap.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      const webp = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.85));
      if (webp && webp.type === "image/webp" && (webp.size < file.size || file.size > MAX_BYTES)) {
        blob = webp;
        filename = file.name.replace(/\.[^.]+$/, "") + ".webp";
      }
    } catch {
      /* unsupported by this browser: upload the original */
    }
  }

  if (blob.size > MAX_BYTES) throw new Error(`${file.name} is too large even after compression (max 3 MB)`);
  return { filename, base64: await toBase64(blob), previewUrl: URL.createObjectURL(blob) };
}

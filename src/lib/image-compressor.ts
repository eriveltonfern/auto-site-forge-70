/**
 * Compresses and converts images to WebP format before upload.
 * Uses Canvas API for client-side conversion — no external dependencies.
 */

interface CompressOptions {
  /** Max width in pixels (default 1920) */
  maxWidth?: number;
  /** Max height in pixels (default 1080) */
  maxHeight?: number;
  /** WebP quality 0-1 (default 0.82) */
  quality?: number;
}

/**
 * Compresses an image File and converts it to WebP format.
 * Returns a new File with .webp extension, smaller size, and better performance.
 */
export async function compressImageToWebP(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  const { maxWidth = 1920, maxHeight = 1080, quality = 0.82 } = options;

  // Skip non-image files (e.g. SVG can stay as-is)
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;

  // Scale down if exceeding max dimensions (preserve aspect ratio)
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context not available");

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await canvas.convertToBlob({ type: "image/webp", quality });

  const baseName = file.name.replace(/\.[^.]+$/, "");
  return new File([blob], `${baseName}.webp`, { type: "image/webp" });
}

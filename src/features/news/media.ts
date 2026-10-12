/**
 * Helpers for pictures and videos inside article bodies.
 *
 * Body syntax (kept deliberately small so staff can read it):
 *   ![Description for screen readers](https://…/photo.jpg "Optional caption")
 *   several image lines with no blank line between them become a gallery
 *   @[video](https://www.youtube.com/watch?v=… "Optional caption")
 */
export const IMAGE_LINE = /^!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]*)")?\)$/;
export const VIDEO_LINE = /^@\[video\]\((\S+?)(?:\s+"([^"]*)")?\)$/;

/** Only https pictures (or small inline previews from demo mode) are ever rendered. */
export function isSafeImageSrc(src: string): boolean {
  return /^https:\/\//i.test(src) || /^data:image\/(png|jpeg|webp|avif);base64,/i.test(src);
}

/** Turns a pasted YouTube or Vimeo link into a privacy-friendly embed URL; null for anything else. */
export function toVideoEmbed(input: string): string | null {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  const host = url.hostname.replace(/^www\./, "");
  const id = /^[\w-]{6,20}$/;
  if ((host === "youtube.com" || host === "youtube-nocookie.com") && url.pathname.startsWith("/embed/")) {
    return id.test(url.pathname.slice(7)) ? `https://www.youtube-nocookie.com/embed/${url.pathname.slice(7)}` : null;
  }
  if (host === "youtube.com" && url.pathname === "/watch") {
    const v = url.searchParams.get("v");
    return v && id.test(v) ? `https://www.youtube-nocookie.com/embed/${v}` : null;
  }
  if (host === "youtube.com" && url.pathname.startsWith("/shorts/")) {
    const v = url.pathname.slice(8);
    return id.test(v) ? `https://www.youtube-nocookie.com/embed/${v}` : null;
  }
  if (host === "youtu.be") {
    const v = url.pathname.slice(1);
    return id.test(v) ? `https://www.youtube-nocookie.com/embed/${v}` : null;
  }
  if (host === "vimeo.com") {
    const v = url.pathname.match(/^\/(\d{5,12})/);
    return v ? `https://player.vimeo.com/video/${v[1]}` : null;
  }
  if (host === "player.vimeo.com") {
    const v = url.pathname.match(/^\/video\/(\d{5,12})/);
    return v ? `https://player.vimeo.com/video/${v[1]}` : null;
  }
  return null;
}

const MAX_BYTES = 5 * 1024 * 1024; // the storage bucket's limit

/**
 * Phone photos are often 6-12 MB, more than the bucket accepts and far more than a web page needs.
 * Shrinks the longest side to 1800 px and re-encodes as JPEG; small PNGs are kept as they are.
 */
export async function prepareImage(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp|avif)$/.test(file.type)) throw new Error("Please choose a JPG, PNG or WebP picture.");
  if (file.type === "image/png" && file.size < 1.5 * 1024 * 1024) return file;
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file.size <= MAX_BYTES ? file : Promise.reject(new Error("That picture could not be read. Try saving it as a JPG."));
  const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.86));
  if (!blob) return file;
  if (blob.size > MAX_BYTES) throw new Error("That picture is still over 5 MB after shrinking. Please choose a smaller one.");
  const base = file.name.replace(/\.[^.]+$/, "") || "picture";
  return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
}

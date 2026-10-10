/**
 * Turns a link pasted from a podcast or video site into the matching embeddable player URL.
 * Returns null when the link is not from a supported host, so staff get an immediate error
 * and visitors never see an arbitrary iframe. The database enforces the same allow-list.
 */
export function toEmbedUrl(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  const host = url.hostname.replace(/^www\./, "");
  const path = url.pathname;

  // Already an embed URL
  if (host === "open.spotify.com" && path.startsWith("/embed/")) return url.toString();
  if ((host === "youtube.com" || host === "youtube-nocookie.com") && path.startsWith("/embed/")) return url.toString();
  if (host === "embed.podcasts.apple.com") return url.toString();
  if (host === "w.soundcloud.com" && path.startsWith("/player/")) return url.toString();

  if (host === "open.spotify.com") {
    const m = path.match(/^\/(?:intl-[a-z]+\/)?(episode|show|track|playlist)\/([A-Za-z0-9]+)/);
    return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}` : null;
  }
  if (host === "youtube.com" && path === "/watch") {
    const id = url.searchParams.get("v");
    return id && /^[\w-]{6,20}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (host === "youtu.be") {
    const id = path.slice(1);
    return /^[\w-]{6,20}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  }
  if (host === "podcasts.apple.com") {
    return `https://embed.podcasts.apple.com${path}${url.search}`;
  }
  if (host === "soundcloud.com") {
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url.toString())}`;
  }
  return null;
}

export function embedHeight(embedUrl: string): number {
  if (embedUrl.includes("open.spotify.com")) return 232;
  if (embedUrl.includes("youtube")) return 315;
  if (embedUrl.includes("soundcloud")) return 166;
  return 175;
}

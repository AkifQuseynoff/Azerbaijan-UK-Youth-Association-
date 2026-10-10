import { embedHeight } from "./embed";

/** Embedded player (allow-listed hosts only) and/or a direct audio file. */
export default function PlayerEmbed({ embedUrl, audioUrl, title }: { embedUrl: string | null; audioUrl: string | null; title: string }) {
  if (!embedUrl && !audioUrl) return null;
  return (
    <div className="space-y-4">
      {embedUrl && (
        <iframe
          src={embedUrl}
          title={`Player: ${title}`}
          width="100%"
          height={embedHeight(embedUrl)}
          loading="lazy"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
          className="rounded-xl border-0 w-full"
        />
      )}
      {audioUrl && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <audio controls preload="none" src={audioUrl} className="w-full" />
      )}
    </div>
  );
}

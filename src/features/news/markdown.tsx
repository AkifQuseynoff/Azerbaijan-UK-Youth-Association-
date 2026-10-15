import type { ReactNode } from "react";
import { createElement } from "react";
import { IMAGE_LINE, VIDEO_LINE, isSafeImageSrc, toVideoEmbed } from "./media";

function inline(text: string, keyPrefix: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = re.exec(text))) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    parts.push(createElement("strong", { key: `${keyPrefix}-b-${i}` }, match[1]));
    last = match.index + match[0].length;
    i += 1;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

type Img = { alt: string; src: string; caption?: string };

function Figure({ img }: { img: Img }) {
  return (
    <figure>
      <img src={img.src} alt={img.alt} loading="lazy" decoding="async" className="h-auto w-full rounded-2xl bg-mist" />
      {img.caption && <figcaption className="mt-2 text-center text-sm text-mute">{img.caption}</figcaption>}
    </figure>
  );
}

function Gallery({ images }: { images: Img[] }) {
  const cols = images.length === 2 || images.length === 4 ? "sm:grid-cols-2" : "sm:grid-cols-3";
  return (
    <div className={`grid grid-cols-2 gap-3 ${cols}`}>
      {images.map((img, i) => (
        <figure key={i} className={images.length % 2 === 1 && i === 0 && images.length === 3 ? "max-sm:col-span-2" : ""}>
          <img src={img.src} alt={img.alt} loading="lazy" decoding="async" className="aspect-[4/3] h-full w-full rounded-2xl bg-mist object-cover" />
          {img.caption && <figcaption className="mt-1.5 text-center text-xs text-mute">{img.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}

function Video({ embed, caption }: { embed: string; caption?: string }) {
  return (
    <figure>
      <div className="aspect-video overflow-hidden rounded-2xl bg-ink">
        <iframe
          src={embed}
          title={caption || "Video"}
          loading="lazy"
          allow="encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
          className="h-full w-full border-0"
        />
      </div>
      {caption && <figcaption className="mt-2 text-center text-sm text-mute">{caption}</figcaption>}
    </figure>
  );
}

/** Renders the small article syntax: headings, lists, bold, pictures, galleries and videos. */
export function MarkdownBody({ source }: { source: string }) {
  const blocks = source.trim().split(/\n{2,}/);

  return createElement(
    "div",
    { className: "space-y-5 leading-relaxed text-mute [&_strong]:text-ink" },
    blocks.map((block, index) => {
      const lines = block.split("\n").map((l) => l.trim());

      const video = lines.length === 1 ? lines[0].match(VIDEO_LINE) : null;
      if (video) {
        const embed = toVideoEmbed(video[1]);
        if (embed) return <Video key={index} embed={embed} caption={video[2]} />;
      }

      const images = lines.map((l) => l.match(IMAGE_LINE));
      if (images.every((m) => m && isSafeImageSrc(m[2]))) {
        const list: Img[] = images.map((m) => ({ alt: m![1], src: m![2], caption: m![3] }));
        return list.length === 1 ? <Figure key={index} img={list[0]} /> : <Gallery key={index} images={list} />;
      }

      if (block.startsWith("## ")) {
        return createElement("h2", { key: index, className: "display mb-2 mt-8 text-3xl text-ink" }, block.replace(/^## /, ""));
      }
      if (lines.every((line) => line.startsWith("- "))) {
        return createElement(
          "ul",
          { key: index, className: "list-disc space-y-2 pl-6" },
          lines.map((line, li) => createElement("li", { key: li }, inline(line.replace(/^- /, ""), `${index}-${li}`))),
        );
      }
      return createElement("p", { key: index }, inline(block.replace(/\n/g, " "), `p-${index}`));
    }),
  );
}

import type { ReactNode } from "react";
import { createElement, Fragment } from "react";

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

export function MarkdownBody({ source }: { source: string }) {
  const blocks = source.trim().split(/\n{2,}/);

  return createElement(
    "div",
    { className: "space-y-5 leading-relaxed text-mute [&_strong]:text-ink" },
    blocks.map((block, index) => {
      const lines = block.split("\n");
      if (block.startsWith("## ")) {
        return createElement(
          "h2",
          {
            key: index,
            className: "display mb-2 mt-8 text-3xl text-ink",
          },
          block.replace(/^## /, ""),
        );
      }
      if (lines.every((line) => line.trim().startsWith("- "))) {
        return createElement(
          "ul",
          { key: index, className: "list-disc pl-6 space-y-2" },
          lines.map((line, li) =>
            createElement("li", { key: li }, inline(line.replace(/^- /, ""), `${index}-${li}`)),
          ),
        );
      }
      return createElement("p", { key: index }, inline(block.replace(/\n/g, " "), `p-${index}`));
    }),
  );
}

export default function Markdown({ source }: { source: string }) {
  return createElement(Fragment, null, createElement(MarkdownBody, { source }));
}

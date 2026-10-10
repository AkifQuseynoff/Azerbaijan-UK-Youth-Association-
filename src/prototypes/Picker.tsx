import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import "./picker.css";

/** Prototype harness chrome. Markup, styles and key bindings follow the prototype skill's PICKER spec. */
export default function Picker({ names, render }: { names: string[]; render: (index: number) => ReactNode }) {
  const initial = () => {
    const v = parseInt(new URLSearchParams(location.search).get("v") ?? "", 10);
    return v >= 1 && v <= names.length ? v - 1 : 0;
  };
  const [current, setCurrent] = useState(initial);
  const [run, setRun] = useState(0);
  const [ready, setReady] = useState(false);
  const nav = useRef<HTMLElement>(null);
  const highlight = useRef<HTMLSpanElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number) => {
    if (i < 0 || i >= names.length) return;
    setCurrent(i);
    setRun((r) => r + 1);
    const url = new URL(location.href);
    url.searchParams.set("v", String(i + 1));
    history.replaceState(null, "", url);
  };

  const move = () => {
    const el = items.current[current];
    if (!el || !highlight.current) return;
    highlight.current.style.width = `${el.offsetWidth}px`;
    highlight.current.style.transform = `translateX(${el.offsetLeft}px)`;
  };

  useLayoutEffect(move, [current]);
  useEffect(() => {
    window.addEventListener("resize", move);
    requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
    return () => window.removeEventListener("resize", move);
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= names.length) select(num - 1);
      else if (e.key === "ArrowRight") select((current + 1) % names.length);
      else if (e.key === "ArrowLeft") select((current - 1 + names.length) % names.length);
      else if (e.key === "r" || e.key === "R") setRun((r) => r + 1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  return (
    <>
      <div key={`${current}-${run}`}>{render(current)}</div>
      <nav ref={nav} className="proto-picker" aria-label="Prototype variants" data-ready={ready ? "" : undefined}>
        <span ref={highlight} className="proto-picker-highlight" aria-hidden="true" />
        {names.map((name, i) => (
          <button
            key={name}
            ref={(el) => {
              items.current[i] = el;
            }}
            type="button"
            className="proto-picker-item"
            data-active={i === current ? "" : undefined}
            aria-current={i === current ? "true" : undefined}
            onClick={() => select(i)}
          >
            {name}
          </button>
        ))}
        <span className="proto-picker-divider" aria-hidden="true" />
        <button type="button" className="proto-picker-item proto-picker-replay" aria-label="Replay animation (R)" onClick={() => setRun((r) => r + 1)}>
          ↻
        </button>
      </nav>
    </>
  );
}

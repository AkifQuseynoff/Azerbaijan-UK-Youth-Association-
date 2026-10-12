/**
 * Ignition: the whole logo (A, Y, the blue swoosh, the red and the green flame) emerges like a fire.
 * Each part is unveiled from its base to its tip through a feathered mask. A band of warm light rides the front of the
 * reveal, clipped to the part's own shape, so the letter seems to catch fire and then cools into its true colour.
 * The part also clears from a soft blur and a warm glow. Nothing is scaled up from nothing.
 * Time-driven only: the pointer does nothing. Returns a cleanup function that restores the plain logo.
 */
const NS = "http://www.w3.org/2000/svg";

export type IgnitePlan = { sel: string; start: number; dur: number }[];

export const DEFAULT_PLAN: IgnitePlan = [
  { sel: ".lg-a", start: 900, dur: 2600 },
  { sel: ".lg-y", start: 1050, dur: 2600 },
  { sel: ".lg-swoosh", start: 1700, dur: 2500 },
  { sel: ".lg-red", start: 2300, dur: 2500 },
  { sel: ".lg-green", start: 2900, dur: 2500 },
];

function el<K extends keyof SVGElementTagNameMap>(name: K, attrs: Record<string, string> = {}): SVGElementTagNameMap[K] {
  const node = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  return node;
}

function stops(grad: SVGLinearGradientElement, list: [number, string | null, number?][], color?: string) {
  for (const [offset, c, opacity] of list) {
    grad.appendChild(el("stop", { offset: String(offset), "stop-color": c ?? color ?? "#000", "stop-opacity": String(opacity ?? 1) }));
  }
  return grad;
}

export function igniteLogo(svg: SVGSVGElement, plan: IgnitePlan = DEFAULT_PLAN): () => void {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || typeof svg.animate !== "function") return () => {};
  const defs = svg.querySelector("defs");
  if (!defs) return () => {};
  const uid = `ig${Math.random().toString(36).slice(2, 7)}`;
  const animations: Animation[] = [];
  const cleanups: (() => void)[] = [];

  plan.forEach((p, i) => {
    const g = svg.querySelector<SVGGElement>(p.sel);
    const fill = g?.querySelector<SVGPathElement>(".lg-fill");
    if (!g || !fill) return;
    const bb = g.getBBox();
    if (!bb.height) return;
    const pad = 14;
    const S = bb.height + pad * 2;
    const F = Math.max(200, bb.height * 0.62);
    const L = 2 * S + F;
    const top = bb.y - pad;
    const id = `${uid}${i}`;
    const x0 = bb.x - 160;
    const w0 = bb.width + 320;
    const travel = S + F;

    const gm = stops(el("linearGradient", { id: `${id}m`, x1: "0", y1: "0", x2: "0", y2: "1" }), [[0, "#000"], [S / L, "#000"], [(S + F) / L, "#fff"], [1, "#fff"]]);
    const mask = el("mask", { id, maskUnits: "userSpaceOnUse", x: String(x0), y: String(bb.y - 140), width: String(w0), height: String(bb.height + 280) });
    const mrect = el("rect", { x: String(x0), y: String(top), width: String(w0), height: String(L), fill: `url(#${id}m)` });
    mask.appendChild(mrect);
    const gb = stops(el("linearGradient", { id: `${id}b`, x1: "0", y1: "0", x2: "0", y2: "1" }), [[0, null, 0], [(S + 0.04 * F) / L, null, 0], [(S + 0.3 * F) / L, null, 0.95], [(S + 0.72 * F) / L, null, 0], [1, null, 0]], "#ffc78f");
    const clip = el("clipPath", { id: `${id}c` });
    clip.appendChild(el("path", { d: fill.getAttribute("d") ?? "", "clip-rule": "evenodd" }));
    const band = el("g", { "clip-path": `url(#${id}c)`, "pointer-events": "none" });
    const brect = el("rect", { x: String(x0), y: String(top), width: String(w0), height: String(L), fill: `url(#${id}b)` });
    band.appendChild(brect);
    for (const n of [gm, mask, gb, clip]) defs.appendChild(n);
    g.appendChild(band);
    fill.setAttribute("mask", `url(#${id})`);

    const ease = "cubic-bezier(0.45, 0.05, 0.25, 1)";
    const move = [{ transform: "translateY(0px)" }, { transform: `translateY(${-travel}px)` }];
    const timing = { duration: p.dur, delay: p.start, easing: ease, fill: "both" as const };
    const wipe = mrect.animate(move, timing);
    const hot = brect.animate(move, timing);
    const g0 = "rgba(255,160,90,0)";
    const g1 = "rgba(255,160,90,0.75)";
    const fx = fill.animate(
      [
        { opacity: 0, filter: `blur(24px) drop-shadow(0 0 0 ${g0})`, transform: "translateY(46px)" },
        { opacity: 0.85, filter: `blur(11px) drop-shadow(0 0 44px ${g1})`, transform: "translateY(20px)", offset: 0.4 },
        { opacity: 1, filter: `blur(0px) drop-shadow(0 0 0 ${g0})`, transform: "translateY(0px)" },
      ],
      { duration: p.dur + 500, delay: p.start, easing: "cubic-bezier(0.3, 0, 0.2, 1)", fill: "both" },
    );
    animations.push(wipe, hot, fx);

    const restore = () => {
      for (const a of [wipe, hot, fx]) {
        try { a.cancel(); } catch { /* already cancelled */ }
      }
      fill.removeAttribute("mask");
      band.remove();
      for (const n of [gm, mask, gb, clip]) n.remove();
    };
    cleanups.push(restore);
    fx.finished.then(restore).catch(() => { /* cancelled */ });
  });

  return () => {
    for (const c of cleanups) c();
    animations.length = 0;
  };
}

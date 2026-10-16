import { useId } from "react";
import { LOGO_PATHS, LOGO_VIEWBOX } from "./logoPaths";

/**
 * The logo mark. Letters and swoosh carry the brand blues; the two flames are separate groups so they can sway
 * (see .lm-red / .lm-green in index.css) or ignite (see HeroMark). `ref` reaches the <svg> for that purpose.
 */
export function LogoMark({ className, ref, decorative = false }: { className?: string; ref?: React.Ref<SVGSVGElement>; decorative?: boolean }) {
  const id = useId();
  const letter = `${id}-l`;
  const swoosh = `${id}-s`;
  return (
    <svg
      ref={ref}
      className={className}
      viewBox={LOGO_VIEWBOX}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : "UK-Azerbaijan Youth Association logo"}
      aria-hidden={decorative || undefined}
      focusable="false"
    >
      <defs>
        <linearGradient id={letter} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1b4793" />
          <stop offset="1" stopColor="#1a4088" />
        </linearGradient>
        <linearGradient id={swoosh} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2f6cc0" />
          <stop offset="1" stopColor="#1f56a6" />
        </linearGradient>
      </defs>
      <g className="lg-part lg-a"><path className="lg-fill" fill={`url(#${letter})`} fillRule="evenodd" d={LOGO_PATHS.a} /></g>
      <g className="lg-part lg-swoosh lm-swoosh"><path className="lg-fill" fill={`url(#${swoosh})`} fillRule="evenodd" d={LOGO_PATHS.swoosh} /></g>
      <g className="lg-part lg-y"><path className="lg-fill" fill={`url(#${letter})`} fillRule="evenodd" d={LOGO_PATHS.y} /></g>
      <g className="lg-part lg-red lm-red"><path className="lg-fill" fill="#c23028" fillRule="evenodd" d={LOGO_PATHS.red} /></g>
      <g className="lg-part lg-green lm-green"><path className="lg-fill" fill="#3e894c" fillRule="evenodd" d={LOGO_PATHS.green} /></g>
    </svg>
  );
}

/** Mark plus a short wordmark, for the header. On dark backgrounds put the mark on a white badge (see BadgeLogo). */
export default function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <LogoMark className="h-10 w-auto" decorative />
      {!compact && (
        <span className="hidden sm:block font-label text-[0.7rem] font-semibold uppercase leading-snug tracking-[0.14em] text-brand-blue">
          UK-Azerbaijan
          <br />
          Youth Association
        </span>
      )}
      <span className="sr-only">UK-Azerbaijan Youth Association, home</span>
    </span>
  );
}

/** The mark on a white tile, for use on dark backgrounds. */
export function BadgeLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`grid h-16 w-16 place-items-center rounded-2xl bg-white ${className}`}>
      <LogoMark className="h-11 w-auto" decorative />
    </span>
  );
}

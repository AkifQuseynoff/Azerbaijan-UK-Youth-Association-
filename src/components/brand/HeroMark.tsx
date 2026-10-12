import { useEffect, useRef } from "react";
import { LogoMark } from "./Logo";
import { igniteLogo } from "./ignite";

/**
 * The hero logo: three tricolour arcs above it (always outside every letter, always behind it), a soft halo,
 * and the logo igniting. Size comes from the --mk-w custom property on the element or an ancestor.
 */
export default function HeroMark({ className = "" }: { className?: string }) {
  const svg = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!svg.current) return;
    return igniteLogo(svg.current);
  }, []);
  return (
    <div className={`mk ${className}`}>
      <div className="mk-halo" />
      <svg className="mk-arcs" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
        <circle className="a" cx="100" cy="100" r="96" pathLength="100" />
        <circle className="b" cx="100" cy="100" r="96" pathLength="100" />
        <circle className="c" cx="100" cy="100" r="96" pathLength="100" />
      </svg>
      <LogoMark ref={svg} className="mk-logo" />
    </div>
  );
}

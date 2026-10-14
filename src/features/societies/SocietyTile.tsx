import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Society } from "./api";

function initialsOf(name: string) {
  return name.split(/\s+/).filter((w) => /^[A-Za-zƏəĞğİıÖöŞşÜüÇç]/.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "S";
}

/**
 * A society as a big tile, the way sponsors are shown: the logo is the hero, the name and university sit underneath.
 * Without a logo (or if it cannot load) the society's initials are shown instead.
 */
export default function SocietyTile({ society }: { society: Society }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [society.logoUrl]);
  const showLogo = Boolean(society.logoUrl) && !failed;

  return (
    <Link
      to={`/societies/${society.slug}`}
      className="card press group flex h-full flex-col items-center gap-5 p-6 text-center transition-shadow duration-200 sm:p-7 [@media(hover:hover)]:hover:shadow-[0_18px_44px_-16px_rgba(14,31,69,0.35)]"
    >
      <div className="relative grid h-32 w-full shrink-0 place-items-center sm:h-40">
        {showLogo ? (
          <img
            src={society.logoUrl}
            alt=""
            loading="lazy"
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-contain transition-transform duration-300 [@media(hover:hover)]:group-hover:scale-105"
          />
        ) : (
          <span aria-hidden="true" className="grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-mist to-[#f9e8df] font-display text-4xl font-medium tracking-tight text-brand-blue ring-1 ring-line sm:h-32 sm:w-32 sm:text-5xl">
            {initialsOf(society.name)}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-[1.25rem] font-medium leading-snug tracking-tight">{society.name}</h3>
        <p className="mt-1 text-sm text-mute">{society.university}</p>
        {society.city && <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.12em] text-brand-blue">{society.city}</p>}
      </div>
    </Link>
  );
}

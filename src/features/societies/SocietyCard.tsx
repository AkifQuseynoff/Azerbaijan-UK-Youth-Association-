import { Link } from "react-router-dom";
import SocietyLogo from "./SocietyLogo";
import type { Society } from "./api";

export default function SocietyCard({ society }: { society: Society }) {
  return (
    <article className="card press h-full">
      <Link to={`/societies/${society.slug}`} className="flex h-full flex-col gap-4 p-6">
        <div className="flex items-center gap-4">
          <SocietyLogo society={society} />
          <div className="min-w-0">
            <h3 className="font-display text-[1.25rem] font-medium leading-snug tracking-tight">{society.name}</h3>
            <p className="text-sm text-mute">{society.university}</p>
          </div>
        </div>
        {society.description && <p className="line-clamp-3 text-[0.95rem] text-mute">{society.description}</p>}
        <div className="mt-auto flex items-center justify-between pt-1">
          {society.city ? <span className="chip bg-mist text-brand-blue">{society.city}</span> : <span />}
          <span className="text-sm font-semibold text-brand-blue">View →</span>
        </div>
      </Link>
    </article>
  );
}

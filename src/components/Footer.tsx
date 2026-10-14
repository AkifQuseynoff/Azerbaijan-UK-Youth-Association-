import { Link } from "react-router-dom";
import ContactCard from "../features/site/ContactCard";
import { useSite } from "../features/site/SiteContext";
import { BadgeLogo } from "./brand/Logo";
import Skyline from "./brand/Skyline";

const nav = [
  { to: "/about", label: "About us" },
  { to: "/news", label: "News" },
  { to: "/events", label: "Events" },
  { to: "/societies", label: "University societies" },
  { to: "/podcast", label: "Podcast" },
  { to: "/register", label: "Join us" },
  { to: "/help", label: "Help" },
];
const resources = [
  { to: "/privacy", label: "Privacy policy" },
  { to: "/terms", label: "Terms of membership" },
  { to: "/help", label: "Help & contact" },
];

/** `skyline` is off on the home page, whose hero already carries the skyline. */
export default function Footer({ skyline = true }: { skyline?: boolean }) {
  const { settings } = useSite();
  return (
    <footer className={`${skyline ? "mt-20" : "mt-24"} bg-ink text-white`}>
      {skyline && (
        <div className="foot-sky" aria-hidden="true">
          <Skyline className="foot-city" nearFill="#0e1f45" farOpacity={0.08} towers="colour" ground />
        </div>
      )}
      <div className={`mx-auto grid max-w-7xl gap-10 px-6 pb-10 md:grid-cols-4 ${skyline ? "pt-4" : "pt-14"}`}>
        <div className="md:col-span-2">
          <div className="flex items-center gap-4">
            <BadgeLogo />
            <p className="font-label text-[0.8rem] font-semibold uppercase leading-relaxed tracking-[0.14em]">
              Azerbaijan–UK
              <br />
              Youth Association
            </p>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">
            A community for young people of Azerbaijani heritage across the United Kingdom.
          </p>
          <div className="mt-6 max-w-sm text-sm"><ContactCard tone="dark" hideEmpty /></div>
          {settings.charityNumber && (
            <p className="mt-6 text-xs text-white/60">Registered charity in England and Wales · No. {settings.charityNumber}</p>
          )}
        </div>
        <nav aria-label="Footer">
          <h2 className="eyebrow !text-white/60">Navigate</h2>
          <ul className="mt-5 space-y-3">
            {nav.map((l) => (
              <li key={l.to}><Link to={l.to} className="text-sm text-white/85 transition-colors hover:text-white">{l.label}</Link></li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="eyebrow !text-white/60">Resources</h2>
          <ul className="mt-5 space-y-3">
            {resources.map((l) => (
              <li key={l.label}><Link to={l.to} className="text-sm text-white/85 transition-colors hover:text-white">{l.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-5 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Azerbaijan UK Youth Association. All rights reserved.
      </div>
    </footer>
  );
}

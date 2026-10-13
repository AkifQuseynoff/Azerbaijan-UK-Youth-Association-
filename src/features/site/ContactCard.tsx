import { Link } from "react-router-dom";
import { hasContact, hasSocial } from "./api";
import { useSite } from "./SiteContext";

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 flex-none text-brand-sky" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

/** Contact details and social links. Whatever has not been filled in under Site details is left out. */
export default function ContactCard({ tone = "light", hideEmpty = false }: { tone?: "light" | "dark"; hideEmpty?: boolean }) {
  const { settings: s } = useSite();
  const dark = tone === "dark";
  const text = dark ? "text-white" : "text-ink";
  const muted = dark ? "text-[#c4d2f0]" : "text-mute";
  const link = dark ? "text-white underline decoration-white/40 underline-offset-4 hover:decoration-white" : "text-brand-blue underline underline-offset-4";

  if (!hasContact(s) && !hasSocial(s)) {
    if (hideEmpty) return null;
    return (
      <p className={muted}>
        Contact details will be published here soon. In the meantime, see <Link to="/help" className={link}>Help</Link>.
      </p>
    );
  }
  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {s.contactEmail && (
          <li className="flex gap-3">
            <Icon d="M4 6h16v12H4zM4 7l8 6 8-6" />
            <a href={`mailto:${s.contactEmail}`} className={`break-all ${link}`}>{s.contactEmail}</a>
          </li>
        )}
        {s.contactPhone && (
          <li className="flex gap-3">
            <Icon d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
            <a href={`tel:${s.contactPhone.replace(/[^\d+]/g, "")}`} className={link}>{s.contactPhone}</a>
          </li>
        )}
        {s.contactAddress && (
          <li className="flex gap-3">
            <Icon d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
            <span className={`whitespace-pre-line ${text}`}>{s.contactAddress}</span>
          </li>
        )}
        {s.contactHours && (
          <li className="flex gap-3">
            <Icon d="M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" />
            <span className={text}>{s.contactHours}</span>
          </li>
        )}
      </ul>
      {hasSocial(s) && (
        <p className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
          {s.instagramUrl && <a href={s.instagramUrl} target="_blank" rel="noopener noreferrer" className={link}>Instagram</a>}
          {s.facebookUrl && <a href={s.facebookUrl} target="_blank" rel="noopener noreferrer" className={link}>Facebook</a>}
          {s.linkedinUrl && <a href={s.linkedinUrl} target="_blank" rel="noopener noreferrer" className={link}>LinkedIn</a>}
        </p>
      )}
    </div>
  );
}

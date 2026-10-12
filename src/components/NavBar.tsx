import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import AdminMenu from "./AdminMenu";
import Logo from "./brand/Logo";

const LINKS = [
  { to: "/news", label: "News" },
  { to: "/events", label: "Events" },
  { to: "/podcast", label: "Podcast" },
  { to: "/help", label: "Help" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { profile, isStaff, isAdmin, signOut } = useAuth();

  const adminLinks = [
    { to: "/admin/news", label: "Newsroom" },
    { to: "/admin/events", label: "Events" },
    { to: "/admin/podcast", label: "Podcast" },
    ...(isAdmin ? [{ to: "/admin/members", label: "Members" }] : []),
  ];

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        setScrolled(window.scrollY > 24);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative rounded-md px-3 py-2 text-[0.94rem] font-semibold transition-colors duration-150 after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-left after:rounded after:bg-brand-red after:transition-transform after:duration-200 ${
      isActive ? "text-brand-blue after:scale-x-100" : "text-ink after:scale-x-0 hover:text-brand-red"
    }`;

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-[72px] transition-[background-color,box-shadow] duration-200 ${
        solid ? "bg-white/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md [@media(prefers-reduced-transparency:reduce)]:bg-white" : ""
      }`}
    >
      <nav className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6" aria-label="Main">
        <Link to="/" className="rounded-md" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>{l.label}</NavLink>
          ))}
          {isStaff && <AdminMenu links={adminLinks} />}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {profile ? (
            <>
              <NavLink to="/account" className={linkClass}>{profile.firstName || "Account"}</NavLink>
              <button type="button" onClick={() => void signOut()} className="rounded-md px-3 py-2 text-[0.94rem] font-semibold text-mute transition-colors hover:text-ink">
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>Log in</NavLink>
              <Link to="/register" className="btn btn-primary btn-sm">Join us</Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full text-ink transition-colors hover:bg-ink/5 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" viewBox="0 0 24 24" aria-hidden="true">
            {open ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="absolute inset-x-0 top-full max-h-[calc(100svh-72px)] overflow-y-auto border-b border-line bg-white px-4 pb-6 pt-2 shadow-card md:hidden">
          <ul className="flex flex-col">
            {LINKS.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) => `block rounded-xl px-3 py-3.5 font-display text-2xl tracking-tight ${isActive ? "text-brand-blue" : "text-ink"}`}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
          {isStaff && (
            <div className="mt-2 border-t border-line pt-3">
              <p className="eyebrow px-3 pb-1 !text-mute">Admin</p>
              {adminLinks.map((link) => (
                <NavLink key={link.to} to={link.to} className="block rounded-xl px-3 py-3 text-base font-semibold text-ink">
                  {link.label}
                </NavLink>
              ))}
            </div>
          )}
          <div className="mt-4 flex flex-col gap-3 border-t border-line pt-5">
            {profile ? (
              <>
                <Link to="/account" className="btn btn-outline">Your account</Link>
                <button type="button" className="btn btn-outline" onClick={() => void signOut()}>Log out</button>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">Join us, it&apos;s free</Link>
                <Link to="/login" className="btn btn-outline">Log in</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

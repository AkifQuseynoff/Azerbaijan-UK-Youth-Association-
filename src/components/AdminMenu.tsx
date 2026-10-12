import { useEffect, useId, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

export type AdminLink = { to: string; label: string };

/** Single "Admin" dropdown that replaces the row of staff links in the desktop nav. */
export default function AdminMenu({ links }: { links: AdminLink[] }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const { pathname } = useLocation();
  const active = pathname.startsWith("/admin");

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-[0.94rem] font-semibold transition-colors duration-150 ${active ? "text-brand-blue" : "text-ink hover:text-brand-red"}`}
      >
        Admin <span aria-hidden="true" className="text-[10px]">▾</span>
      </button>
      {open && (
        <div id={menuId} role="menu" className="absolute right-0 mt-2 w-52 rounded-2xl bg-white py-2 shadow-card ring-1 ring-line">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              role="menuitem"
              className={({ isActive }) => `block px-4 py-2.5 text-sm transition-colors hover:bg-mist ${isActive ? "font-semibold text-brand-blue" : "text-ink"}`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

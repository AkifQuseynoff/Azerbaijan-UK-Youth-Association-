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
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
          active ? "bg-white/15 text-white" : "text-blue-200 hover:text-white hover:bg-white/10"
        }`}
      >
        Admin <span aria-hidden="true" className="text-[10px]">▾</span>
      </button>
      {open && (
        <div id={menuId} role="menu" className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-gray-200 shadow-lg py-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              role="menuitem"
              className={({ isActive }) => `block px-4 py-2.5 text-sm hover:bg-gray-50 ${isActive ? "font-semibold text-[#003580]" : "text-[#0D1B2A]"}`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

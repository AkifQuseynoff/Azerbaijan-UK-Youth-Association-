import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import Logo from "./Logo";

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { profile, isStaff, signOut } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive ? "bg-white/15 text-white" : "text-blue-200 hover:text-white hover:bg-white/10"
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#002060] border-b border-[#003580]/60 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" onClick={() => setMobileOpen(false)}>
          <Logo />
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/news" className={linkClass}>News</NavLink>
          <NavLink to="/events" className={linkClass}>Events</NavLink>
          <NavLink to="/help" className={linkClass}>Help</NavLink>
          {isStaff && (
            <>
              <NavLink to="/admin/news" className={linkClass}>Newsroom</NavLink>
              <NavLink to="/admin/events" className={linkClass}>Manage events</NavLink>
            </>
          )}
          {profile ? (
            <>
              <NavLink to="/account" className={linkClass}>{profile.firstName || "Account"}</NavLink>
              <button
                type="button"
                onClick={() => void signOut()}
                className="px-4 py-2 rounded-lg text-sm font-medium text-blue-200 hover:text-white hover:bg-white/10"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>Log in</NavLink>
              <Link
                to="/register"
                className="ml-4 px-5 py-2 rounded-full bg-[#CC2229] hover:bg-[#e83038] text-white font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Join Us
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-white p-2 rounded-lg hover:bg-white/10"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#002060] border-t border-[#003580]/40 px-4 py-3 flex flex-col gap-1">
          {[
            { to: "/", label: "Home" },
            { to: "/news", label: "News" },
            { to: "/events", label: "Events" },
            { to: "/help", label: "Help" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `w-full text-left px-4 py-3 rounded-lg text-sm font-medium ${isActive ? "bg-white/15 text-white" : "text-blue-200"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          {isStaff && (
            <>
              <NavLink to="/admin/news" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-sm text-blue-200">
                Newsroom
              </NavLink>
              <NavLink to="/admin/events" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-sm text-blue-200">
                Manage events
              </NavLink>
            </>
          )}
          {profile ? (
            <>
              <NavLink to="/account" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-sm text-blue-200">
                Account
              </NavLink>
              <button
                type="button"
                className="px-4 py-3 rounded-lg text-sm text-left text-blue-200"
                onClick={() => {
                  setMobileOpen(false);
                  void signOut();
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-sm text-blue-200">
                Log in
              </NavLink>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="mt-2 bg-[#CC2229] text-white text-center px-4 py-3 rounded-lg text-sm font-medium"
              >
                Join Us Free
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

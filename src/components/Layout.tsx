import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useLayoutEffect } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default function Layout() {
  const { pathname, hash } = useLocation();

  // Every page starts from the default title; pages that know better (events, episodes) set their own afterwards.
  useLayoutEffect(() => {
    document.title = "Azerbaijan UK Youth Association";
  }, [pathname]);

  // New page, new scroll position (instant; a smooth scroll over freshly swapped content looks like a glitch).
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);

  // The home page starts with a full-bleed hero that sits under the header; every other page clears it.
  const home = pathname === "/";

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only z-[70] rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        Skip to content
      </a>
      <NavBar />
      <main id="main" tabIndex={-1} className={`flex-1 outline-none ${home ? "" : "pt-[72px]"}`}>
        <Outlet />
      </main>
      <Footer skyline={!home} />
    </div>
  );
}

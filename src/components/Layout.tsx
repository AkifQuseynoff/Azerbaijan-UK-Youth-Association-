import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useLayoutEffect } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { SITE, SITE_ORIGIN } from "../config/site";

const PAGE_TITLES: Record<string, string> = {
  "/about": "About us",
  "/events": "Events",
  "/podcast": "Podcast",
  "/news": "News",
  "/help": "Help",
  "/register": "Join us",
  "/privacy": "Privacy policy",
  "/terms": "Terms of membership",
};
const PRIVATE = [/^\/admin/, /^\/account/, /^\/login/, /^\/forgot-password/, /^\/reset-password/];

export default function Layout() {
  const { pathname, hash } = useLocation();

  // Every page starts from a sensible title, canonical address and robots rule; pages that know better
  // (events, episodes, articles) set their own title afterwards.
  useLayoutEffect(() => {
    const title = PAGE_TITLES[pathname];
    document.title = title ? `${title} · ${SITE.name}` : SITE.name;

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${SITE_ORIGIN}${pathname === "/" ? "" : pathname.replace(/\/$/, "")}`;

    // Private pages (staff screens, account, sign-in) are kept out of search results.
    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"][data-managed]');
    if (PRIVATE.some((re) => re.test(pathname))) {
      if (!robots) {
        robots = document.createElement("meta");
        robots.name = "robots";
        robots.setAttribute("data-managed", "");
        document.head.appendChild(robots);
      }
      robots.content = "noindex, nofollow";
    } else {
      robots?.remove();
    }
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

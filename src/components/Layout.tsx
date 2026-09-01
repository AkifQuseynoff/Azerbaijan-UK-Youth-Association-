import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="min-h-full flex flex-col">
      <NavBar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

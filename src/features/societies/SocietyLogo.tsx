import { useEffect, useState } from "react";
import type { Society } from "./api";

/** The society's logo, or its initials on a soft tile when there is no logo (or it cannot be loaded). */
export default function SocietyLogo({ society, size = "md" }: { society: Pick<Society, "name" | "logoUrl">; size?: "md" | "lg" }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [society.logoUrl]);
  const box = size === "lg" ? "h-28 w-28 rounded-3xl" : "h-16 w-16 rounded-2xl";
  if (society.logoUrl && !failed) {
    return (
      <span className={`grid flex-none place-items-center overflow-hidden bg-white p-2 ring-1 ring-line ${box}`}>
        <img src={society.logoUrl} alt="" loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-contain" />
      </span>
    );
  }
  const initials = society.name.split(/\s+/).filter((w) => /^[A-Za-zƏəĞğİıÖöŞşÜüÇç]/.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "S";
  return (
    <span aria-hidden="true" className={`grid flex-none place-items-center bg-gradient-to-br from-mist to-[#f9e8df] font-display font-medium tracking-tight text-brand-blue ring-1 ring-line ${box} ${size === "lg" ? "text-4xl" : "text-xl"}`}>
      {initials}
    </span>
  );
}

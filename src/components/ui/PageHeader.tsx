import type { ReactNode } from "react";
import FlagDivider from "./FlagDivider";

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
  width = "max-w-7xl",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  width?: string;
}) {
  return (
    <>
      <div className="bg-[#002060] py-16 px-6">
        <div className={`${width} mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-4`}>
          <div>
            {eyebrow && <p className="text-[#00997A] font-semibold text-sm uppercase tracking-wider mb-3">{eyebrow}</p>}
            <h1 className="text-5xl text-white font-display">{title}</h1>
            {subtitle && <p className="text-blue-200 mt-3 text-lg max-w-xl">{subtitle}</p>}
          </div>
          {action}
        </div>
      </div>
      <FlagDivider />
    </>
  );
}

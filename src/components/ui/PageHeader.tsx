import type { ReactNode } from "react";
import Skyline from "../brand/Skyline";

/** The header of every inner page: dawn sky with a quiet skyline, an eyebrow, a display title and an optional action. */
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
    <header className="page-head px-5 pb-14 pt-12 sm:px-8 sm:pt-16 sm:pb-20">
      <Skyline className="page-head-city" nearFill="#1b4793" nearOpacity={0.2} farOpacity={0.06} towers="same" />
      <div className={`${width} mx-auto flex flex-col gap-5 md:flex-row md:items-end md:justify-between`}>
        <div>
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h1 className="display text-[2.4rem] sm:text-5xl lg:text-6xl">{title}</h1>
          {subtitle && <p className="mt-4 max-w-xl text-lg text-mute">{subtitle}</p>}
        </div>
        {action}
      </div>
    </header>
  );
}

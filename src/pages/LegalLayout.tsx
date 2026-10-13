import type { ReactNode } from "react";
import PageHeader from "../components/ui/PageHeader";

/** Shared layout for the privacy policy and the terms: a header, a "last updated" line and readable sections. */
export default function LegalLayout({ title, updated, intro, children }: { title: string; updated: string; intro: string; children: ReactNode }) {
  return (
    <div className="page-transition">
      <PageHeader eyebrow="Legal" title={title} subtitle={intro} width="max-w-3xl" />
      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <p className="mb-8 text-sm text-mute">Last updated {updated}</p>
        <div className="space-y-10 leading-relaxed text-mute [&_a]:font-semibold [&_a]:text-brand-blue [&_a]:underline [&_a]:underline-offset-4 [&_li]:pl-1 [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">{children}</div>
      </div>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="display text-2xl text-ink sm:text-3xl">{title}</h2>
      {children}
    </section>
  );
}

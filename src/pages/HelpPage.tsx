import { useId, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import { SITE } from "../config/site";
import ContactCard from "../features/site/ContactCard";
import { FAQ } from "../data/faq";

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const base = useId();

  return (
    <div className="page-transition">
      <PageHeader eyebrow="Support" title="Help & resources" subtitle="Everything you need to make the most of your membership." />

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        {SITE.programmes.length > 0 && (
          <div className="mb-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SITE.programmes.map((item) => (
              <div key={item.title} className="card border-t-4 border-brand-sky p-6">
                <h3 className="mb-1 font-display text-lg font-medium tracking-tight">{item.title}</h3>
                <p className="text-sm text-mute">{item.description}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <h2 className="display mb-6 text-3xl sm:text-4xl">Frequently asked questions</h2>
            <div className="space-y-3">
              {FAQ.map((item, i) => {
                const open = openFaq === i;
                return (
                  <div key={i} className="card overflow-hidden">
                    <h3>
                      <button
                        type="button"
                        id={`${base}-q${i}`}
                        aria-expanded={open}
                        aria-controls={`${base}-a${i}`}
                        className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-mist/60"
                        onClick={() => setOpenFaq(open ? null : i)}
                      >
                        <span className="pr-4 text-base font-semibold">{item.q}</span>
                        <svg className={`h-5 w-5 flex-shrink-0 text-brand-blue transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </h3>
                    {open && (
                      <div id={`${base}-a${i}`} role="region" aria-labelledby={`${base}-q${i}`} className="px-6 pb-5">
                        <div className="mb-4 h-px bg-line" />
                        <p className="text-[0.96rem] leading-relaxed text-mute">{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl bg-gradient-to-b from-ink to-[#14295a] p-7 text-white">
              <h3 className="display mb-4 text-2xl text-white">Contact us</h3>
              <ContactCard tone="dark" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

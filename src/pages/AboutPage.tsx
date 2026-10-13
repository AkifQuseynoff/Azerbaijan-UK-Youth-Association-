import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import Reveal from "../components/ui/Reveal";
import { DEFAULT_ABOUT, PILLARS } from "../data/pillars";
import ActivityCard from "../features/activities/ActivityCard";
import { listPublishedActivities } from "../features/activities/api";
import type { Activity } from "../features/activities/api";
import ContactCard from "../features/site/ContactCard";
import { useSite } from "../features/site/SiteContext";

export default function AboutPage() {
  const { settings } = useSite();
  const [activities, setActivities] = useState<Activity[] | null>(null);

  useEffect(() => {
    listPublishedActivities().then(setActivities).catch(() => setActivities([]));
  }, []);

  const paragraphs = (settings.about || DEFAULT_ABOUT).split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <div className="page-transition">
      <PageHeader eyebrow="About us" title="Who we are" subtitle="A community for young Azerbaijanis in the UK." />
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="max-w-2xl space-y-5 text-lg text-mute">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <aside className="card self-start p-6 sm:p-7" aria-labelledby="contact-title">
            <h2 id="contact-title" className="display mb-4 text-2xl">Get in touch</h2>
            <ContactCard />
            {settings.charityNumber && <p className="mt-5 border-t border-line pt-4 text-xs text-mute">Registered charity in England and Wales · No. {settings.charityNumber}</p>}
          </aside>
        </div>

        <Reveal className="mt-16 grid gap-5 md:grid-cols-3">
          {PILLARS.map((p) => (
            <article key={p.title} className="relative overflow-hidden rounded-[22px] bg-gradient-to-b from-mist to-white px-7 pb-8 pt-9 ring-1 ring-line">
              <span aria-hidden="true" className={`absolute left-7 top-0 h-1 w-14 rounded-b ${p.tone}`} />
              <p className="font-label text-xs font-semibold tracking-[0.18em] text-mute">{p.n}</p>
              <h3 className="mt-2 font-display text-[1.6rem] font-medium tracking-tight">{p.title}</h3>
              <p className="mt-2 text-mute">{p.desc}</p>
            </article>
          ))}
        </Reveal>

        <section id="activities" className="mt-20 scroll-mt-24" aria-labelledby="activities-title">
          <h2 id="activities-title" className="display mb-8 text-[2rem] sm:text-5xl">What we&apos;ve been doing</h2>
          {activities === null ? (
            <p className="text-mute">Loading…</p>
          ) : activities.length === 0 ? (
            <div className="card px-6 py-10 text-center">
              <p className="font-display text-2xl tracking-tight">Our story is being written</p>
              <p className="mt-1 text-mute">Highlights from our events and projects will appear here. See what is on in the meantime on the <Link to="/events" className="font-semibold text-brand-blue underline underline-offset-4">events page</Link>.</p>
            </div>
          ) : (
            <Reveal className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activities.map((a) => (
                <ActivityCard key={a.id} activity={a} />
              ))}
            </Reveal>
          )}
        </section>
      </div>
    </div>
  );
}

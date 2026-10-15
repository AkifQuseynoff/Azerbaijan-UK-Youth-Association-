import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import HeroMark from "../components/brand/HeroMark";
import Skyline from "../components/brand/Skyline";
import Reveal from "../components/ui/Reveal";
import Waveform from "../components/ui/Waveform";
import { SITE } from "../config/site";
import { DEFAULT_ABOUT, PILLARS } from "../data/pillars";
import ActivityCard from "../features/activities/ActivityCard";
import { listPublishedActivities } from "../features/activities/api";
import type { Activity } from "../features/activities/api";
import ContactCard from "../features/site/ContactCard";
import { listPublishedSocieties } from "../features/societies/api";
import type { Society } from "../features/societies/api";
import SocietyTile from "../features/societies/SocietyTile";
import { useSite } from "../features/site/SiteContext";
import { useAuth } from "../features/auth/AuthContext";
import { eventsApi } from "../features/events/api";
import EventTicket from "../features/events/EventTicket";
import LiveBadge from "../features/events/LiveBadge";
import { isHappeningNow } from "../features/events/types";
import type { EventItem } from "../features/events/types";
import { useNow } from "../lib/useNow";
import NewsCard from "../features/news/NewsCard";
import { listLatestPublished } from "../features/news/api";
import { listPublishedEpisodes } from "../features/podcasts/api";
import { episodeLabel } from "../features/podcasts/types";
import type { Episode } from "../features/podcasts/types";
import type { Article } from "../types";


export default function HomePage() {
  const { profile } = useAuth();
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [latest, setLatest] = useState<Article[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [societies, setSocieties] = useState<Society[]>([]);
  const { settings } = useSite();
  const hero = useRef<HTMLElement>(null);
  const now = useNow();

  useEffect(() => {
    eventsApi.listUpcoming().then((list) => setEvents(list.filter((e) => e.status === "published"))).catch(() => setEvents([]));
    listPublishedEpisodes(1).then((list) => setEpisode(list[0] ?? null)).catch(() => undefined);
    void listLatestPublished(3).then(setLatest).catch(() => undefined);
    listPublishedActivities(3).then(setActivities).catch(() => undefined);
    listPublishedSocieties().then(setSocieties).catch(() => undefined);
  }, []);

  // The skyline drifts a little as the page scrolls. Bound to scroll, not to the pointer, so it works on a phone too.
  useEffect(() => {
    const node = hero.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        node.style.setProperty("--sy", String(Math.min(window.scrollY, 1400)));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const liveNow = (events ?? []).filter((e) => isHappeningNow(e, now));
  const upcoming = (events ?? []).filter((e) => !isHappeningNow(e, now)).slice(0, 3);

  return (
    <>
      <section ref={hero} className="hero" aria-labelledby="home-title">
        <div className="hero-sun" aria-hidden="true" />
        <Skyline className="hero-city" nearFill="#0e1f45" farOpacity={0.09} towers="colour" ground />
        <div className="hero-ground" aria-hidden="true" />
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="eyebrow mb-4">Azerbaijan · United Kingdom</p>
            <h1 id="home-title" className="display text-[2.5rem] sm:text-6xl lg:text-[5.2rem] lg:leading-none">
              Two homes.
              <br />
              <em className="font-medium text-brand-blue">One community.</em>
            </h1>
            <p className="mb-7 mt-5 max-w-[30em] text-[1.14rem] text-mute">
              A free community for young Azerbaijanis in the UK: events worth turning up to, a podcast, and people who get it.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 max-md:justify-center">
              {profile ? (
                <Link to="/events" className="btn btn-primary btn-lg">Browse events</Link>
              ) : (
                <Link to="/register" className="btn btn-primary btn-lg max-sm:w-full max-sm:max-w-80">Join the community</Link>
              )}
              <a href="#events" className="link-u">See what&apos;s on</a>
            </div>
          </div>
          <div className="hero-mark">
            <HeroMark />
          </div>
        </div>
      </section>

      <section id="events" className="mx-auto max-w-7xl scroll-mt-20 px-5 pb-8 pt-20 sm:px-8" aria-labelledby="events-title">
        <div className="mb-8 flex items-baseline justify-between gap-4">
          <h2 id="events-title" className="display text-[2rem] sm:text-5xl">On the calendar</h2>
          <Link to="/events" className="link-u whitespace-nowrap">All events</Link>
        </div>
        {liveNow.length > 0 && (
          <div className="mb-8 grid gap-4">
            {liveNow.map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.slug}`}
                className="press flex flex-col gap-3 rounded-[24px] bg-gradient-to-br from-ink to-[#14295a] p-6 text-[#eaf0ff] shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-7"
              >
                <div>
                  <LiveBadge className="!bg-white/10 !text-[#ff9d95]" />
                  <p className="mt-3 font-display text-2xl font-medium tracking-tight text-white sm:text-3xl">{event.title}</p>
                  {event.venue && <p className="mt-1 text-[#c4d2f0]">{event.venue}</p>}
                </div>
                <span className="btn btn-light btn-sm self-start sm:self-center">See details</span>
              </Link>
            ))}
          </div>
        )}
        {events === null ? (
          <p className="text-mute">Loading events…</p>
        ) : upcoming.length === 0 && liveNow.length > 0 ? null : upcoming.length === 0 ? (
          <div className="card px-6 py-10 text-center">
            <p className="font-display text-2xl tracking-tight">No events announced yet</p>
            <p className="mt-1 text-mute">New dates are added here as soon as they are confirmed.</p>
          </div>
        ) : (
          <Reveal className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((event, i) => (
              <EventTicket key={event.id} event={event} index={i} />
            ))}
          </Reveal>
        )}
      </section>

      {episode && (
        <section className="mt-16 bg-gradient-to-b from-ink to-[#14295a] text-[#eaf0ff]" aria-labelledby="podcast-title">
          <Reveal className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="eyebrow mb-3 !text-[#ff8a80]">
                The podcast{episodeLabel(episode) ? ` · ${episodeLabel(episode)}` : ""}
                {episode.durationMinutes ? ` · ${episode.durationMinutes} min` : ""}
              </p>
              <h2 id="podcast-title" className="display text-[2rem] text-white sm:text-5xl">{episode.title}</h2>
              {episode.guests && <p className="mt-2 font-bold text-[#8fd29c]">With {episode.guests}</p>}
              <p className="mt-3 max-w-[34em] text-[#c4d2f0] line-clamp-4">{episode.description}</p>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link to={`/podcast/${episode.slug}`} className="btn btn-light btn-lg">Listen to this episode</Link>
                <Link to="/podcast" className="font-bold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">All episodes</Link>
              </div>
            </div>
            <div className="rounded-3xl bg-white/[0.07] p-6 ring-1 ring-white/12">
              <Waveform />
            </div>
          </Reveal>
        </section>
      )}

      {latest.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pt-20 sm:px-8" aria-labelledby="news-title">
          <div className="mb-8 flex items-baseline justify-between gap-4">
            <h2 id="news-title" className="display text-[2rem] sm:text-5xl">Community news</h2>
            <Link to="/news" className="link-u whitespace-nowrap">All news</Link>
          </div>
          <Reveal className="grid gap-6 md:grid-cols-3">
            {latest.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </Reveal>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-5 pt-20 sm:px-8" aria-labelledby="about-title">
        <div className="mb-8 max-w-2xl">
          <p className="eyebrow mb-3">About us</p>
          <h2 id="about-title" className="display text-[2rem] sm:text-5xl">A bridge between two nations, one generation at a time</h2>
          <p className="mt-4 text-lg text-mute">{(settings.about || DEFAULT_ABOUT).split(/\n{2,}/)[0]}</p>
          <p className="mt-4"><Link to="/about" className="link-u">More about us</Link></p>
        </div>
        {SITE.stats.length > 0 && (
          <dl className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {SITE.stats.map((s) => (
              <div key={s.label} className="card px-5 py-4">
                <dt className="order-2 text-sm text-mute">{s.label}</dt>
                <dd className="font-display text-3xl tracking-tight">{s.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <Reveal className="grid gap-5 md:grid-cols-3">
          {PILLARS.map((p) => (
            <article key={p.title} className="relative overflow-hidden rounded-[22px] bg-gradient-to-b from-mist to-white px-7 pb-8 pt-9 ring-1 ring-line">
              <span aria-hidden="true" className={`absolute left-7 top-0 h-1 w-14 rounded-b ${p.tone}`} />
              <p className="font-label text-xs font-semibold tracking-[0.18em] text-mute">{p.n}</p>
              <h3 className="mt-2 font-display text-[1.6rem] font-medium tracking-tight">{p.title}</h3>
              <p className="mt-2 text-mute">{p.desc}</p>
            </article>
          ))}
        </Reveal>
      </section>

      {activities.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pt-20 sm:px-8" aria-labelledby="activities-title">
          <div className="mb-8 flex items-baseline justify-between gap-4">
            <h2 id="activities-title" className="display text-[2rem] sm:text-5xl">What we&apos;ve been doing</h2>
            <Link to="/about#activities" className="link-u whitespace-nowrap">See all</Link>
          </div>
          <Reveal className="grid gap-6 md:grid-cols-3">
            {activities.map((a) => (
              <ActivityCard key={a.id} activity={a} />
            ))}
          </Reveal>
        </section>
      )}

      {societies.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pt-20 sm:px-8" aria-labelledby="societies-title">
          <div className="mb-8 flex items-baseline justify-between gap-4">
            <div>
              <h2 id="societies-title" className="display text-[2rem] sm:text-5xl">Azerbaijan Societies of Universities</h2>
              <p className="mt-3 max-w-xl text-lg text-mute">Azerbaijani student societies across the UK. Find the one at your university.</p>
            </div>
            <Link to="/societies" className="link-u whitespace-nowrap">See all</Link>
          </div>
          <Reveal className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {societies.slice(0, 8).map((s) => (
              <SocietyTile key={s.id} society={s} />
            ))}
          </Reveal>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-5 pt-20 sm:px-8" aria-labelledby="contact-title">
        <div className="grid gap-8 rounded-[28px] bg-gradient-to-br from-ink to-[#14295a] p-7 text-[#eaf0ff] sm:p-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <h2 id="contact-title" className="display text-[2rem] text-white sm:text-4xl">Get in touch</h2>
            <p className="mt-3 max-w-md text-[#c4d2f0]">Questions, ideas or a partnership in mind? We would like to hear from you.</p>
          </div>
          <ContactCard tone="dark" />
        </div>
      </section>

      {!profile && (
        <section className="mx-auto max-w-7xl px-5 pt-20 sm:px-8">
          <Reveal className="rounded-[28px] bg-gradient-to-br from-mist via-white to-[#f9e8df] px-6 py-12 text-center ring-1 ring-line sm:py-16">
            <h2 className="display text-[2rem] sm:text-5xl">Membership is free.</h2>
            <p className="mx-auto mb-7 mt-3 max-w-xl text-lg text-mute">Make an account, register for events in one tap, and keep your tickets on your phone.</p>
            <Link to="/register" className="btn btn-primary btn-lg">Join the community</Link>
          </Reveal>
        </section>
      )}
    </>
  );
}

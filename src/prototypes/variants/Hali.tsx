import { useState } from "react";
import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/fraunces/full-italic.css";
import "@fontsource-variable/instrument-sans/wght.css";
import { SAMPLE } from "../data";
import "./hali.css";

const noop = (e: React.MouseEvent) => e.preventDefault();

/** n-pointed star polygon made of two overlapping squares (an octagram when n = 8). */
function octagram(cx: number, cy: number, r: number) {
  const square = (rot: number) =>
    [0, 1, 2, 3]
      .map((k) => {
        const a = ((rot + k * 90) * Math.PI) / 180;
        return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
      })
      .join(" ");
  return [square(45), square(0)];
}

function Rug({ palette = "red" }: { palette?: "red" | "indigo" }) {
  const field = palette === "red" ? "#8A1A27" : "#17224A";
  const band = palette === "red" ? "#1F2E5B" : "#9E1F2C";
  const diamonds = Array.from({ length: 9 }, (_, i) => 62 + i * 34.5);
  return (
    <svg viewBox="0 -18 400 536" className="hali-rug" role="img" aria-label="Woven rug pattern">
      {Array.from({ length: 50 }, (_, i) => (
        <g key={i} stroke="#231A16" strokeOpacity=".45" strokeWidth="1.4">
          <line x1={4 + i * 8} y1="-14" x2={4 + i * 8} y2="0" />
          <line x1={4 + i * 8} y1="500" x2={4 + i * 8} y2="514" />
        </g>
      ))}
      <rect y="0" width="400" height="500" fill={field} />
      <rect x="10" y="10" width="380" height="480" fill="none" stroke="#D8A02B" strokeWidth="3" />
      <rect x="22" y="22" width="356" height="456" fill={band} />
      <rect x="46" y="46" width="308" height="408" fill={field} />
      {diamonds.map((x) => (
        <g key={x}>
          <polygon points={`${x},28 ${x + 8},34 ${x},40 ${x - 8},34`} fill="#D8A02B" />
          <polygon points={`${x},460 ${x + 8},466 ${x},472 ${x - 8},466`} fill="#D8A02B" />
        </g>
      ))}
      {octagram(200, 250, 128).map((p, i) => (
        <polygon key={i} points={p} fill="#F4ECDD" />
      ))}
      {octagram(200, 250, 100).map((p, i) => (
        <polygon key={i} points={p} fill="#D8A02B" />
      ))}
      {octagram(200, 250, 74).map((p, i) => (
        <polygon key={i} points={p} fill={band} />
      ))}
      <circle cx="200" cy="250" r="38" fill={field} />
      {octagram(200, 250, 26).map((p, i) => (
        <polygon key={i} points={p} fill="#F4ECDD" />
      ))}
      {[
        [96, 110],
        [304, 110],
        [96, 390],
        [304, 390],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <polygon points={`${x},${y - 20} ${x + 20},${y} ${x},${y + 20} ${x - 20},${y}`} fill="#F4ECDD" />
          <polygon points={`${x},${y - 11} ${x + 11},${y} ${x},${y + 11} ${x - 11},${y}`} fill={band} />
        </g>
      ))}
    </svg>
  );
}

function Boteh({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true">
      <path
        d="M25 4C14 5 7 14 7 25c0 11 8 19 18 19 8 0 13-5 13-11 0-6-4-9-9-9-4 0-7 3-7 6 0 3 2 5 5 5"
        fill="none"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <circle cx="21" cy="22" r="3" fill={color} />
      <circle cx="29" cy="14" r="2" fill={color} />
    </svg>
  );
}

export default function Hali() {
  const [playing, setPlaying] = useState(false);
  const { events, episode, pillars } = SAMPLE;
  const rise = (d: number) => ({ "--d": `${d}ms` }) as React.CSSProperties;

  return (
    <div className="hali">
      <div className="hali-band" />
      <header className="hali-nav">
        <a href="#" onClick={noop} className="hali-logo">
          <svg viewBox="0 0 40 40" width="30" height="30" aria-hidden="true">
            {octagram(20, 20, 18).map((p, i) => (
              <polygon key={i} points={p} fill={i ? "#D8A02B" : "#9E1F2C"} />
            ))}
            <circle cx="20" cy="20" r="6" fill="#F4ECDD" />
          </svg>
          <span>Az Youth UK</span>
        </a>
        <nav className="hali-links" aria-label="Main">
          {["News", "Events", "Podcast", "Help"].map((l) => (
            <a key={l} href="#" onClick={noop}>
              {l}
            </a>
          ))}
        </nav>
        <div className="hali-nav-end">
          <a href="#" onClick={noop} className="hali-link">
            Log in
          </a>
          <a href="#" onClick={noop} className="hali-btn hali-btn-sm">
            Join us
          </a>
        </div>
      </header>

      <section className="hali-hero">
        <div className="hali-hero-copy">
          <p className="hali-eyebrow hali-rise" style={rise(0)}>
            Azərbaycan <span aria-hidden="true">✦</span> United Kingdom
          </p>
          <h1 className="hali-h1 hali-rise" style={rise(70)}>
            Home, <em>away</em> from home.
          </h1>
          <p className="hali-lede hali-rise" style={rise(140)}>
            A free community for young Azerbaijanis in the UK: events worth turning up to, a podcast, and people who get it.
          </p>
          <div className="hali-actions hali-rise" style={rise(210)}>
            <a href="#" onClick={noop} className="hali-btn">
              Join the community
            </a>
            <a href="#events" onClick={noop} className="hali-textlink">
              See what&apos;s on
            </a>
          </div>
        </div>
        <div className="hali-hero-art hali-rug-in">
          <Rug />
        </div>
      </section>

      <div className="hali-band hali-band-thin" />

      <section className="hali-section" id="events">
        <div className="hali-section-head">
          <h2 className="hali-h2">Coming up</h2>
          <a href="#" onClick={noop} className="hali-textlink">
            All events
          </a>
        </div>
        <ul className="hali-events">
          {events.map((e) => (
            <li key={e.title}>
              <a href="#" onClick={noop} className="hali-event">
                <span className="hali-date">
                  <b>{e.day}</b>
                  <i>{e.month}</i>
                </span>
                <span className="hali-event-main">
                  <strong>{e.title}</strong>
                  <small>
                    {e.time} · {e.place}
                  </small>
                </span>
                <span className={`hali-spots ${e.left <= 5 ? "is-low" : ""}`}>{e.left <= 5 ? `${e.left} places left` : `${e.left} places`}</span>
                <span className="hali-arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="hali-podcast">
        <div className="hali-band hali-band-flip" />
        <div className="hali-podcast-inner">
          <div className="hali-podcast-art">
            <Rug palette="indigo" />
          </div>
          <div className="hali-podcast-copy">
            <p className="hali-eyebrow hali-eyebrow-light">The podcast · Episode {episode.no}</p>
            <h2 className="hali-h2 hali-h2-light">{episode.title}</h2>
            <p className="hali-podcast-meta">
              {episode.guest} · {episode.mins} min
            </p>
            <p className="hali-podcast-blurb">{episode.blurb}</p>
            <div className="hali-player">
              <button type="button" className="hali-play" aria-pressed={playing} aria-label={playing ? "Pause" : "Play episode"} onClick={() => setPlaying((p) => !p)}>
                {playing ? (
                  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                    <rect x="6" y="5" width="4" height="14" fill="currentColor" />
                    <rect x="14" y="5" width="4" height="14" fill="currentColor" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                    <polygon points="8,5 19,12 8,19" fill="currentColor" />
                  </svg>
                )}
              </button>
              <div className="hali-track" role="presentation">
                <span className={`hali-track-fill ${playing ? "is-playing" : ""}`} />
              </div>
              <span className="hali-time">0:00 / {episode.mins}:00</span>
            </div>
          </div>
        </div>
      </section>

      <section className="hali-section hali-about">
        <h2 className="hali-h2">What we&apos;re about</h2>
        <div className="hali-pillars">
          {pillars.map((p, i) => (
            <article key={p.name} className="hali-pillar">
              <Boteh color={["#9E1F2C", "#1F2E5B", "#B9821A"][i]} />
              <h3>{p.name}</h3>
              <p>{p.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="hali-cta">
        <div className="hali-band hali-band-gold" />
        <div className="hali-cta-inner">
          <h2>Membership is free.</h2>
          <p>Create an account, register for events and never miss an episode.</p>
          <a href="#" onClick={noop} className="hali-btn hali-btn-light">
            Join us
          </a>
        </div>
      </section>

      <footer className="hali-footer">
        <p>© 2026 Azerbaijan UK Youth Association</p>
        <p>Privacy · Terms · Help</p>
      </footer>
      <div className="hali-band" />
    </div>
  );
}

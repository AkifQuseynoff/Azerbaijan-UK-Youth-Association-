import { useState } from "react";
import "@fontsource-variable/archivo/wdth.css";
import { SAMPLE } from "../data";
import "./alov.css";

const noop = (e: React.MouseEvent) => e.preventDefault();
const vars = (o: Record<string, string | number>) => o as React.CSSProperties;
const BARS = Array.from({ length: 36 }, (_, i) => 0.22 + 0.78 * Math.abs(Math.sin(i * 0.9) * Math.cos(i * 0.37)));
const TICKER = ["Events", "Podcast", "News", "Community", "Free to join"];

export default function Alov() {
  const [playing, setPlaying] = useState(false);
  const { events, episode, pillars } = SAMPLE;
  const tones = ["flame", "saffron", "cream"];

  return (
    <div className="alov">
      <header className="alov-nav">
        <a href="#" onClick={noop} className="alov-logo" aria-label="Az Youth UK, home">
          AZ<span>/</span>UK
        </a>
        <nav className="alov-links" aria-label="Main">
          {["News", "Events", "Podcast", "Help"].map((l) => (
            <a key={l} href="#" onClick={noop}>
              {l}
            </a>
          ))}
        </nav>
        <div className="alov-nav-end">
          <a href="#" onClick={noop} className="alov-login">
            Log in
          </a>
          <a href="#" onClick={noop} className="alov-btn alov-btn-sm">
            Join
          </a>
        </div>
      </header>

      <section className="alov-hero">
        <h1 className="alov-h1" aria-label="Azerbaijani youth in the UK">
          <span className="alov-w alov-w1" aria-hidden="true" style={vars({ "--i": 0 })}>
            Azerbaijani
          </span>
          <span className="alov-w alov-w2" aria-hidden="true" style={vars({ "--i": 1 })}>
            Youth in the UK
          </span>
        </h1>
        <a href="#" onClick={noop} className="alov-sticker" aria-label="Free to join">
          <span>Free</span>
          <span>to</span>
          <span>join</span>
        </a>
        <div className="alov-hero-foot">
          <p className="alov-lede">Events you&apos;ll actually want to go to, a podcast, and a crowd that gets it.</p>
          <div className="alov-actions">
            <a href="#" onClick={noop} className="alov-btn">
              Join us <span aria-hidden="true">↗</span>
            </a>
            <a href="#events" onClick={noop} className="alov-textlink">
              What&apos;s on
            </a>
          </div>
        </div>
      </section>

      <div className="alov-ticker" aria-hidden="true">
        <div className="alov-ticker-track">
          {[0, 1].map((n) => (
            <div key={n} className="alov-ticker-set">
              {TICKER.map((t) => (
                <span key={t}>
                  {t} <i>✦</i>
                </span>
              ))}
              {TICKER.map((t) => (
                <span key={`${t}-b`}>
                  {t} <i>✦</i>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="alov-section" id="events">
        <div className="alov-head">
          <h2 className="alov-h2">On soon</h2>
          <a href="#" onClick={noop} className="alov-textlink">
            All events
          </a>
        </div>
        <div className="alov-tickets">
          {events.map((e, i) => (
            <a key={e.title} href="#" onClick={noop} className={`alov-ticket tone-${tones[i % 3]}`} style={vars({ "--i": i })}>
              <span className="alov-stub">
                <b>{e.day}</b>
                <i>{e.month}</i>
              </span>
              <span className="alov-ticket-body">
                <small>{e.tag}</small>
                <strong>{e.title}</strong>
                <span className="alov-ticket-meta">
                  {e.time} · {e.place}
                </span>
                <span className={`alov-left ${e.left <= 5 ? "is-low" : ""}`}>{e.left <= 5 ? `Only ${e.left} left` : `${e.left} places`}</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="alov-podcast">
        <div className="alov-podcast-inner">
          <button type="button" className={`alov-record ${playing ? "is-playing" : ""}`} aria-pressed={playing} aria-label={playing ? "Pause episode" : "Play episode"} onClick={() => setPlaying((p) => !p)}>
            <span className="alov-record-label">
              <small>Ep.</small>
              {episode.no}
            </span>
            <span className="alov-record-hint" aria-hidden="true">
              {playing ? "❚❚" : "▶"}
            </span>
          </button>
          <div className="alov-podcast-copy">
            <p className="alov-kicker">{playing ? "Now playing" : "Latest episode"}</p>
            <h2 className="alov-h2 alov-ep-title">{episode.title}</h2>
            <p className="alov-ep-meta">
              {episode.guest} · {episode.mins} min
            </p>
            <p className="alov-ep-blurb">{episode.blurb}</p>
            <div className={`alov-wave ${playing ? "is-playing" : ""}`} aria-hidden="true">
              {BARS.map((h, i) => (
                <span key={i} style={vars({ "--h": h.toFixed(2), "--i": i })} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="alov-section">
        <div className="alov-head">
          <h2 className="alov-h2">What it&apos;s about</h2>
        </div>
        <ul className="alov-pillars">
          {pillars.map((p) => (
            <li key={p.name} className="alov-pillar">
              <span className="alov-pillar-word">{p.name}</span>
              <p>{p.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="alov-cta">
        <h2>
          Join us.
          <br />
          It&apos;s free.
        </h2>
        <a href="#" onClick={noop} className="alov-btn alov-btn-dark">
          Create your account <span aria-hidden="true">↗</span>
        </a>
      </section>

      <footer className="alov-footer">
        <p>© 2026 Azerbaijan UK Youth Association</p>
        <p>Privacy · Terms · Help</p>
      </footer>
    </div>
  );
}

import { useState } from "react";
import "@fontsource-variable/bricolage-grotesque/standard.css";
import "@fontsource-variable/newsreader/opsz.css";
import "@fontsource-variable/newsreader/opsz-italic.css";
import "@fontsource-variable/instrument-sans/wght.css";
import { SAMPLE } from "../data";
import "./kaspi.css";

const noop = (e: React.MouseEvent) => e.preventDefault();
const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export default function Kaspi() {
  const [playing, setPlaying] = useState(false);
  const { events, episode, pillars } = SAMPLE;

  return (
    <div className="kaspi">
      <header className="kaspi-nav">
        <a href="#" onClick={noop} className="kaspi-logo" aria-label="Az Youth UK, home">
          <span className="kaspi-flag" aria-hidden="true">
            <i style={{ background: "#00b5e2" }} />
            <i style={{ background: "#ef3340" }} />
            <i style={{ background: "#509e2f" }} />
          </span>
          Az Youth UK
        </a>
        <nav className="kaspi-links" aria-label="Main">
          {["News", "Events", "Podcast", "Help"].map((l) => (
            <a key={l} href="#" onClick={noop}>
              {l}
            </a>
          ))}
        </nav>
        <div className="kaspi-nav-end">
          <a href="#" onClick={noop} className="kaspi-login">
            Log in
          </a>
          <a href="#" onClick={noop} className="kaspi-btn kaspi-btn-sm">
            Join <span aria-hidden="true">→</span>
          </a>
        </div>
      </header>

      <section className="kaspi-hero">
        <ul className="kaspi-meta kaspi-fade" style={d(0)}>
          <li>Azerbaijan UK Youth Association</li>
          <li>UK-wide</li>
          <li>Free to join</li>
          <li>Events · Podcast · News</li>
        </ul>
        <h1 className="kaspi-h1" aria-label="Young. Azerbaijani. Here.">
          {["Young.", "Azerbaijani.", "Here."].map((w, i) => (
            <span key={w} className="kaspi-line" aria-hidden="true">
              <span className={i === 2 ? "is-accent" : ""} style={d(120 + i * 90)}>
                {w}
              </span>
            </span>
          ))}
        </h1>
        <div className="kaspi-intro kaspi-fade" style={d(520)}>
          <p className="kaspi-label">About</p>
          <p className="kaspi-intro-text">
            A community for young people of Azerbaijani heritage across the United Kingdom, and anyone drawn to the culture. Come for an event, stay for the people.
          </p>
          <div className="kaspi-intro-cta">
            <a href="#" onClick={noop} className="kaspi-btn">
              Join the community <span aria-hidden="true">→</span>
            </a>
            <a href="#events" onClick={noop} className="kaspi-link">
              See what&apos;s on
            </a>
          </div>
        </div>
      </section>

      <section className="kaspi-section" id="events">
        <div className="kaspi-section-head">
          <span className="kaspi-index">01</span>
          <h2 className="kaspi-h2">On the calendar</h2>
          <a href="#" onClick={noop} className="kaspi-link">
            All events
          </a>
        </div>
        <div className="kaspi-table" role="table" aria-label="Upcoming events">
          <div className="kaspi-row kaspi-row-head" role="row">
            <span role="columnheader">Date</span>
            <span role="columnheader">Event</span>
            <span role="columnheader">Where</span>
            <span role="columnheader">Places</span>
            <span aria-hidden="true" />
          </div>
          {events.map((e) => (
            <a key={e.title} href="#" onClick={noop} className="kaspi-row kaspi-row-link" role="row">
              <span className="kaspi-cell-date" role="cell">
                <b>{e.day}</b> {e.month}
              </span>
              <span className="kaspi-cell-title" role="cell">
                {e.title}
                <small>{e.tag}</small>
              </span>
              <span role="cell">
                {e.place} <small>{e.time}</small>
              </span>
              <span className={`kaspi-cell-spots ${e.left <= 5 ? "is-low" : ""}`} role="cell">
                {e.left}
                <small>/{e.cap}</small>
              </span>
              <span className="kaspi-row-arrow" aria-hidden="true">
                →
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="kaspi-section kaspi-podcast">
        <div className="kaspi-section-head">
          <span className="kaspi-index">02</span>
          <h2 className="kaspi-h2">The podcast</h2>
          <a href="#" onClick={noop} className="kaspi-link">
            All episodes
          </a>
        </div>
        <div className="kaspi-podcast-grid">
          <p className="kaspi-big-no" aria-label={`Episode ${episode.no}`}>
            <span aria-hidden="true">No.</span>
            {episode.no}
          </p>
          <div>
            <h3 className="kaspi-ep-title">{episode.title}</h3>
            <p className="kaspi-label">
              {episode.guest} · {episode.mins} min
            </p>
            <p className="kaspi-ep-blurb">{episode.blurb}</p>
            <div className="kaspi-player">
              <button type="button" className="kaspi-play" aria-pressed={playing} aria-label={playing ? "Pause" : "Play episode"} onClick={() => setPlaying((p) => !p)}>
                {playing ? "❚❚" : "▶"}
              </button>
              <div className="kaspi-track" role="presentation">
                <span className={playing ? "is-playing" : ""} />
              </div>
              <span className="kaspi-time">0:00 / {episode.mins}:00</span>
            </div>
          </div>
        </div>
      </section>

      <section className="kaspi-section">
        <div className="kaspi-section-head">
          <span className="kaspi-index">03</span>
          <h2 className="kaspi-h2">What we&apos;re about</h2>
        </div>
        <ol className="kaspi-pillars">
          {pillars.map((p, i) => (
            <li key={p.name}>
              <span className="kaspi-label">0{i + 1}</span>
              <h3>{p.name}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="kaspi-cta">
        <h2>
          Join.
          <br />
          It&apos;s free.
        </h2>
        <a href="#" onClick={noop} className="kaspi-btn kaspi-btn-inverse">
          Create your account <span aria-hidden="true">→</span>
        </a>
      </section>

      <footer className="kaspi-footer">
        <div className="kaspi-footer-row">
          <p>© 2026 Azerbaijan UK Youth Association</p>
          <p>Privacy · Terms · Help</p>
        </div>
        <p className="kaspi-wordmark" aria-hidden="true">
          Az Youth UK
        </p>
      </footer>
    </div>
  );
}

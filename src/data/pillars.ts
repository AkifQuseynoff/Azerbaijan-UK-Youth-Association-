export const PILLARS = [
  { n: "01", tone: "bg-brand-sky", title: "Culture & heritage", desc: "Celebrating Azerbaijani culture through events, music, art and language, keeping traditions alive in the diaspora." },
  { n: "02", tone: "bg-brand-red", title: "Education & careers", desc: "Talks, workshops and networking to help young people develop their skills and careers." },
  { n: "03", tone: "bg-brand-green", title: "Community & belonging", desc: "A welcoming home for every Azerbaijani in the UK: new arrivals, long-term residents and second-generation members alike." },
] as const;

/** Shown until an admin writes their own text under Site details. */
export const DEFAULT_ABOUT =
  "The Azerbaijan UK Youth Association is a community for young people of Azerbaijani heritage, and anyone interested in Azerbaijani culture, who live in the United Kingdom.\n\nWe support cultural exchange, learning and community, helping the Azerbaijani diaspora stay connected to its roots while thriving in British society.";

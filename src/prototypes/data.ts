// Sample content for the design prototypes only. Never shipped: the prototype route exists in dev builds only.
export const SAMPLE = {
  events: [
    { day: "14", month: "Nov", title: "Language Café", place: "Camden, London", time: "18:30", left: 12, cap: 30, tag: "Education" },
    { day: "22", month: "Nov", title: "Mugham & Mingle", place: "Barbican, London", time: "19:00", left: 40, cap: 150, tag: "Culture" },
    { day: "05", month: "Dec", title: "Career Night: Law & Finance", place: "The City, London", time: "18:00", left: 3, cap: 120, tag: "Networking" },
  ],
  episode: {
    no: 14,
    title: "Between Two Homes",
    guest: "with Aysel Mammadova",
    mins: 42,
    blurb: "Growing up in the UK with Baku in the kitchen: language, food, family phone calls and what \"home\" means when you have two.",
  },
  pillars: [
    { name: "Culture", text: "Music, food, language and the traditions we carry with us, shared at events people actually want to go to." },
    { name: "Learning", text: "Talks, workshops and networking that help young people grow their skills and careers." },
    { name: "Community", text: "A place to belong, whether you were born in Baku, Birmingham or somewhere in between." },
  ],
};
export type Sample = typeof SAMPLE;

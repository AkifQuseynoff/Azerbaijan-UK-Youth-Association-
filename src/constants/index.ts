export const CITIES = ["London", "Manchester", "Birmingham", "Edinburgh", "Cardiff", "Leeds", "Glasgow", "Bristol", "Other"];

export const INTERESTS = [
  "Cultural events", "Language classes", "Career networking", "Scholarship opportunities",
  "Mentorship", "Volunteering", "Sports & recreation", "Arts & music",
];

/** Badge colours shared by news categories and event categories: soft tints of the logo colours. */
export const categoryColors: Record<string, string> = {
  Culture: "bg-brand-green/12 text-[#2c6638]",
  Events: "bg-brand-sky/12 text-brand-blue",
  Community: "bg-brand-blue/10 text-brand-blue",
  Announcements: "bg-brand-red/10 text-brand-red-dark",
  Education: "bg-brand-sky/12 text-brand-blue-dark",
  Networking: "bg-ink/8 text-ink",
  Leadership: "bg-amber-100 text-amber-800",
  Podcast: "bg-brand-red/10 text-brand-red-dark",
};

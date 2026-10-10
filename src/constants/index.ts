export const CITIES = ["London", "Manchester", "Birmingham", "Edinburgh", "Cardiff", "Leeds", "Glasgow", "Bristol", "Other"];

export const INTERESTS = [
  "Cultural events", "Language classes", "Career networking", "Scholarship opportunities",
  "Mentorship", "Volunteering", "Sports & recreation", "Arts & music",
];

export const HEARD_FROM_OPTIONS = [
  "Friend or family member", "Social media (Instagram)", "Social media (Facebook)",
  "University / college", "Google search", "Attended an event", "Other",
];

/** Badge colours shared by news categories and event categories. */
export const categoryColors: Record<string, string> = {
  Culture: "bg-teal-600 text-white",
  Events: "bg-blue-700 text-white",
  Community: "bg-purple-600 text-white",
  Announcements: "bg-red-600 text-white",
  Education: "bg-emerald-600 text-white",
  Networking: "bg-indigo-600 text-white",
  Leadership: "bg-amber-600 text-white",
  Podcast: "bg-rose-600 text-white",
};

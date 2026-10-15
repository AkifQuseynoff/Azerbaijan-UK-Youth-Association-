/**
 * Facts about the Association that appear on the site.
 *
 * Only put confirmed information here. Every empty value is hidden from the public site,
 * so nothing invented is ever shown. Fill these in once the Association confirms them.
 */
/** The one canonical address of the public site (used for canonical links and search engines). */
export const SITE_ORIGIN = "https://www.azukyouthassociation.com";

export interface SiteConfig {
  name: string;
  /** Registered charity number, e.g. "1234567". Leave null if not a registered charity. */
  charityNumber: string | null;
  contact: {
    email: string | null;
    address: string | null;
    phone: string | null;
    hours: string | null;
  };
  /** Verified figures for the homepage, e.g. { value: "500+", label: "Members" }. */
  stats: { value: string; label: string }[];
  /** Short founding story for the About section. */
  story: string | null;
  /** Programmes that really exist, shown on the Help page, e.g. { title, description }. */
  programmes: { title: string; description: string }[];
}

export const SITE: SiteConfig = {
  name: "Azerbaijan UK Youth Association",
  charityNumber: null,
  contact: { email: null, address: null, phone: null, hours: null },
  stats: [],
  story: null,
  programmes: [],
};

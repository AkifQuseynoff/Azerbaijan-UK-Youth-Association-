/**
 * Facts about the Association that appear on the site.
 *
 * Only put confirmed information here. Every empty value is hidden from the public site,
 * so nothing invented is ever shown. Fill these in once the Association confirms them.
 */
/** The one canonical address of the public site (used for canonical links and search engines). */
export const SITE_ORIGIN = "https://www.azukyouthassociation.com";

/**
 * The legal entity behind the site, as registered at Companies House. UK company law requires the
 * registered name, number, place of registration and registered office on the website.
 */
export const LEGAL = {
  name: "UK-Azerbaijan Youth Association (UKAYA) CIC",
  kind: "community interest company",
  number: "17526049",
  registeredIn: "England and Wales",
  office: "182-184 High Street North, London E6 2JA",
  companiesHouseUrl: "https://find-and-update.company-information.service.gov.uk/company/17526049",
} as const;

export interface SiteConfig {
  name: string;
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
  name: "UK-Azerbaijan Youth Association",
  contact: { email: null, address: null, phone: null, hours: null },
  stats: [],
  story: null,
  programmes: [],
};

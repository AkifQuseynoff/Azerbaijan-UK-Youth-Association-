export type NewsCategory = "All" | "Culture" | "Events" | "Community" | "Announcements";
export type ArticleCategory = Exclude<NewsCategory, "All">;
export type ArticleStatus = "draft" | "scheduled" | "published";
export type MemberRole = "member" | "editor" | "admin";
export type MemberStatus = "active" | "deactivated";

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: ArticleCategory;
  coverUrl: string;
  coverPath: string | null;
  authorName: string;
  authorId: string | null;
  status: ArticleStatus;
  featured: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleInput {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: ArticleCategory;
  coverUrl?: string;
  coverFile?: File | null;
  authorName: string;
  status: ArticleStatus;
  featured: boolean;
  publishedAt: string | null;
}

export interface Profile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  city: string;
  occupation: string;
  university: string;
  memberType: string;
  heardFrom: string;
  newsletter: boolean;
  interests: string[];
  role: MemberRole;
  status: MemberStatus;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth: string;
  city: string;
  occupation: string;
  university: string;
  heardFrom: string;
  newsletter: boolean;
  interests: string[];
  termsAccepted: boolean;
}

export const NEWS_CATEGORIES: NewsCategory[] = ["All", "Culture", "Events", "Community", "Announcements"];
export const ARTICLE_CATEGORIES: ArticleCategory[] = ["Culture", "Events", "Community", "Announcements"];

export function readTimeFromBody(body: string): string {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function formatArticleDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** ISO timestamp -> value for <input type="datetime-local"> in the viewer's own timezone. */
export function toLocalInputValue(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

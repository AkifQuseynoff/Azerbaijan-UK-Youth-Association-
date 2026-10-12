import { SEED_ARTICLES } from "./seedArticles";
import type { Article, ArticleInput, NewsCategory } from "../../types";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

const LOCAL_KEY = "auya_articles";
const PAGE_SIZE = 6;
// Scheduled articles go live on their own once published_at has passed.
const LIVE_STATUSES: Article["status"][] = ["published", "scheduled"];

type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: Article["category"];
  cover_path: string | null;
  author_name: string;
  author_id: string | null;
  status: Article["status"];
  featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export function coverPublicUrl(path: string | null, fallback = ""): string {
  if (!path) return fallback;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  if (!supabase) return fallback;
  const { data } = supabase.storage.from("news-covers").getPublicUrl(path);
  return data.publicUrl;
}

function fromRow(row: ArticleRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    category: row.category,
    coverPath: row.cover_path,
    coverUrl: coverPublicUrl(row.cover_path),
    authorName: row.author_name,
    authorId: row.author_id,
    status: row.status,
    featured: row.featured,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function isLive(article: Article, now = Date.now()): boolean {
  if (!LIVE_STATUSES.includes(article.status) || !article.publishedAt) return false;
  return new Date(article.publishedAt).getTime() <= now;
}

function loadLocal(): Article[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(SEED_ARTICLES));
      return SEED_ARTICLES.map((a) => ({ ...a }));
    }
    return JSON.parse(raw) as Article[];
  } catch {
    return SEED_ARTICLES.map((a) => ({ ...a }));
  }
}

function saveLocal(articles: Article[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(articles));
}

function matchesQuery(article: Article, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  return (
    article.title.toLowerCase().includes(q) ||
    article.excerpt.toLowerCase().includes(q) ||
    article.body.toLowerCase().includes(q)
  );
}

export async function listPublishedArticles(options: {
  category?: NewsCategory;
  query?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ articles: Article[]; featured: Article | null; total: number; pageSize: number }> {
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? PAGE_SIZE;
  const category = options.category && options.category !== "All" ? options.category : undefined;
  const query = options.query ?? "";

  if (supabase && isSupabaseConfigured) {
    let request = supabase
      .from("articles")
      .select("*", { count: "exact" })
      .in("status", LIVE_STATUSES)
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false });

    if (category) request = request.eq("category", category);
    if (query.trim()) {
      const like = `%${query.trim().replace(/[%(),]/g, "")}%`;
      request = request.or(`title.ilike.${like},excerpt.ilike.${like},body.ilike.${like}`);
    }

    const featuredQuery = supabase
      .from("articles")
      .select("*")
      .in("status", LIVE_STATUSES)
      .eq("featured", true)
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false })
      .limit(1);

    const [{ data, error, count }, featuredRes] = await Promise.all([
      request.range((page - 1) * pageSize, page * pageSize - 1),
      featuredQuery,
    ]);
    if (error) throw error;

    const featuredRow = (featuredRes.data ?? [])[0] as ArticleRow | undefined;
    const featured = featuredRow ? fromRow(featuredRow) : null;
    return {
      articles: ((data ?? []) as ArticleRow[]).map(fromRow),
      featured: !category && !query ? featured : null,
      total: count ?? 0,
      pageSize,
    };
  }

  const all = loadLocal()
    .filter((a) => isLive(a))
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
  const featured = all.find((a) => a.featured) ?? all[0] ?? null;
  const filtered = all.filter((a) => (!category || a.category === category) && matchesQuery(a, query));
  const start = (page - 1) * pageSize;
  return {
    articles: filtered.slice(start, start + pageSize),
    featured: !category && !query ? featured : null,
    total: filtered.length,
    pageSize,
  };
}

export async function getPublishedArticle(slug: string): Promise<Article | null> {
  if (supabase && isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .in("status", LIVE_STATUSES)
      .lte("published_at", new Date().toISOString())
      .maybeSingle();
    if (error) throw error;
    return data ? fromRow(data as ArticleRow) : null;
  }
  return loadLocal().find((a) => a.slug === slug && isLive(a)) ?? null;
}

export async function getRelatedArticles(article: Article, limit = 3): Promise<Article[]> {
  if (supabase && isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .in("status", LIVE_STATUSES)
      .eq("category", article.category)
      .neq("id", article.id)
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return ((data ?? []) as ArticleRow[]).map(fromRow);
  }
  return loadLocal()
    .filter((a) => a.id !== article.id && a.category === article.category && isLive(a))
    .slice(0, limit);
}

export async function listLatestPublished(limit = 3): Promise<Article[]> {
  const { articles } = await listPublishedArticles({ page: 1, pageSize: limit });
  return articles;
}

export async function listStaffArticles(): Promise<Article[]> {
  if (supabase && isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return ((data ?? []) as ArticleRow[]).map(fromRow);
  }
  return loadLocal().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getStaffArticle(id: string): Promise<Article | null> {
  if (supabase && isSupabaseConfigured) {
    const { data, error } = await supabase.from("articles").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? fromRow(data as ArticleRow) : null;
  }
  return loadLocal().find((a) => a.id === id) ?? null;
}

export async function uploadCover(file: File, slug: string): Promise<string> {
  if (!supabase) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${slug}-${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("news-covers").upload(path, file, { upsert: false });
  if (error) throw error;
  return path;
}

export async function saveArticle(id: string | null, input: ArticleInput, authorId: string | null): Promise<Article> {
  let coverPath: string | null = input.coverUrl ?? null;
  if (input.coverFile) {
    coverPath = await uploadCover(input.coverFile, input.slug);
  }

  const publishedAt = input.status === "published" ? input.publishedAt ?? new Date().toISOString() : input.publishedAt;
  if (input.status === "scheduled" && !publishedAt) {
    throw new Error("Choose a date and time to schedule this article.");
  }

  if (supabase && isSupabaseConfigured) {
    const payload = {
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt,
      body: input.body,
      category: input.category,
      cover_path: coverPath,
      author_name: input.authorName,
      author_id: authorId,
      status: input.status,
      featured: input.featured,
      published_at: publishedAt,
    };
    if (id) {
      const { data, error } = await supabase.from("articles").update(payload).eq("id", id).select("*").single();
      if (error) throw error;
      return fromRow(data as ArticleRow);
    }
    const { data, error } = await supabase.from("articles").insert(payload).select("*").single();
    if (error) throw error;
    return fromRow(data as ArticleRow);
  }

  const articles = loadLocal();
  const now = new Date().toISOString();
  if (id) {
    const next = articles.map((a) =>
      a.id === id
        ? {
            ...a,
            ...input,
            coverPath,
            coverUrl: coverPath && (coverPath.startsWith("http") || coverPath.startsWith("data:")) ? coverPath : a.coverUrl,
            authorId,
            publishedAt,
            updatedAt: now,
          }
        : a,
    );
    saveLocal(next);
    return next.find((a) => a.id === id)!;
  }

  const created: Article = {
    id: crypto.randomUUID(),
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    body: input.body,
    category: input.category,
    coverPath,
    coverUrl: coverPath && (coverPath.startsWith("http") || coverPath.startsWith("data:")) ? coverPath : "",
    authorName: input.authorName,
    authorId,
    status: input.status,
    featured: input.featured,
    publishedAt,
    createdAt: now,
    updatedAt: now,
  };
  saveLocal([created, ...articles]);
  return created;
}

/** Best effort: removes a cover picture from storage. A failure here must never stop the delete itself. */
export async function removeCoverFile(path: string | null): Promise<void> {
  if (!supabase || !path || path.startsWith("http") || path.startsWith("data:")) return;
  await supabase.storage.from("news-covers").remove([path]).catch(() => undefined);
}

export async function deleteArticle(id: string): Promise<void> {
  if (supabase && isSupabaseConfigured) {
    const { data: row } = await supabase.from("articles").select("cover_path").eq("id", id).maybeSingle();
    // A delete that row-level security refuses returns no error and no rows, so check what actually went.
    const { data, error } = await supabase.from("articles").delete().eq("id", id).select("id");
    if (error) throw error;
    if (!data || data.length === 0) throw new Error("The article could not be deleted.");
    await removeCoverFile((row as { cover_path: string | null } | null)?.cover_path ?? null);
    return;
  }
  saveLocal(loadLocal().filter((a) => a.id !== id));
}

export async function setArticleStatus(id: string, status: Article["status"]): Promise<void> {
  const publishedAt = status === "published" ? new Date().toISOString() : undefined;
  if (supabase && isSupabaseConfigured) {
    const payload: Record<string, unknown> = { status };
    if (publishedAt) payload.published_at = publishedAt;
    const { error } = await supabase.from("articles").update(payload).eq("id", id);
    if (error) throw error;
    return;
  }
  saveLocal(
    loadLocal().map((a) =>
      a.id === id
        ? { ...a, status, publishedAt: publishedAt ?? a.publishedAt, updatedAt: new Date().toISOString() }
        : a,
    ),
  );
}

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Field, SelectField, TextAreaField } from "../../../components/ui/Field";
import FlagDivider from "../../../components/ui/FlagDivider";
import { useAuth } from "../../auth/AuthContext";
import { getStaffArticle, saveArticle } from "../api";
import { ARTICLE_CATEGORIES, slugify, toLocalInputValue, type ArticleCategory, type ArticleStatus } from "../../../types";

export default function AdminNewsEditorPage() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    body: "",
    category: "Community" as ArticleCategory,
    coverUrl: "",
    authorName: profile ? `${profile.firstName} ${profile.lastName}`.trim() : "Association Communications",
    status: "draft" as ArticleStatus,
    featured: false,
    publishedAt: "",
  });

  useEffect(() => {
    if (isNew) return;
    void getStaffArticle(id).then((article) => {
      if (!article) {
        setError("Article not found.");
        return;
      }
      setForm({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        body: article.body,
        category: article.category,
        coverUrl: article.coverUrl,
        authorName: article.authorName,
        status: article.status,
        featured: article.featured,
        publishedAt: toLocalInputValue(article.publishedAt),
      });
    });
  }, [id, isNew]);

  const handleTitle = (title: string) => {
    setForm((f) => ({
      ...f,
      title,
      slug: isNew || !f.slug ? slugify(title) : f.slug,
    }));
  };

  const persist = async (status: ArticleStatus) => {
    setPending(true);
    setError("");
    try {
      const publishedAt =
        status === "scheduled" && form.publishedAt
          ? new Date(form.publishedAt).toISOString()
          : status === "published"
            ? form.publishedAt
              ? new Date(form.publishedAt).toISOString()
              : new Date().toISOString()
            : form.publishedAt
              ? new Date(form.publishedAt).toISOString()
              : null;
      const saved = await saveArticle(
        isNew ? null : id,
        {
          title: form.title,
          slug: form.slug || slugify(form.title),
          excerpt: form.excerpt,
          body: form.body,
          category: form.category,
          coverUrl: form.coverUrl,
          coverFile,
          authorName: form.authorName,
          status,
          featured: form.featured,
          publishedAt,
        },
        profile?.id ?? null,
      );
      navigate(`/admin/news/${saved.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save article.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="page-transition min-h-screen bg-[#F4F6FB]">
      <div className="bg-[#002060] py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/admin/news" className="text-blue-200 text-sm">Back to newsroom</Link>
          <h1 className="text-4xl text-white mt-3" style={{ fontFamily: "'DM Serif Display', serif" }}>
            {isNew ? "New article" : "Edit article"}
          </h1>
        </div>
      </div>
      <FlagDivider />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl p-8 border border-gray-100 space-y-5">
          <div>
            <Field label="Title" value={form.title} onChange={(e) => handleTitle(e.target.value)} />
          </div>
          <div>
            <Field label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <SelectField label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ArticleCategory })} options={ARTICLE_CATEGORIES} />
            </div>
            <div>
              <Field label="Byline" value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} />
            </div>
          </div>
          <div>
            <TextAreaField label="Excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={3} />
          </div>
          <div>
            <TextAreaField label="Body (Markdown)" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={12} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm resize-y font-mono" />
          </div>
          <div>
            <label htmlFor="cover-file" className="block text-sm font-medium mb-1.5">Cover image</label>
            <input id="cover-file" type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} className="text-sm" />
            {form.coverUrl && !coverFile && (
              <img src={form.coverUrl} alt="" className="mt-3 h-32 object-cover rounded-xl" />
            )}
          </div>
          <div>
            <Field label="Publish at (for scheduling)" type="datetime-local" value={form.publishedAt} onChange={(e) => setForm({ ...form, publishedAt: e.target.value })} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-[#003580]" />
            Featured on the news homepage
          </label>
          {error && <p className="text-[#CC2229] text-sm">{error}</p>}
          <div className="flex flex-wrap gap-3">
            <button type="button" disabled={pending} onClick={() => void persist("draft")} className="px-5 py-3 border border-gray-300 rounded-xl font-semibold disabled:opacity-50">
              Save draft
            </button>
            <button type="button" disabled={pending || !form.publishedAt} onClick={() => void persist("scheduled")} className="px-5 py-3 bg-amber-600 text-white rounded-xl font-semibold disabled:opacity-50">
              Schedule
            </button>
            <button type="button" disabled={pending} onClick={() => void persist("published")} className="px-5 py-3 bg-[#CC2229] text-white rounded-xl font-semibold disabled:opacity-50">
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

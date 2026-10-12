import { useState } from "react";
import { Link } from "react-router-dom";
import { INTERESTS } from "../../constants";
import { Field } from "../../components/ui/Field";
import PageHeader from "../../components/ui/PageHeader";
import MyRegistrations from "../events/MyRegistrations";
import { useAuth } from "../auth/AuthContext";

export default function AccountPage() {
  const { profile, updateProfile, signOut, isStaff } = useAuth();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(() => ({
    firstName: profile?.firstName ?? "",
    lastName: profile?.lastName ?? "",
    phone: profile?.phone ?? "",
    city: profile?.city ?? "",
    occupation: profile?.occupation ?? "",
    university: profile?.university ?? "",
    newsletter: profile?.newsletter ?? false,
    interests: profile?.interests ?? [],
  }));

  if (!profile) return null;

  const toggleInterest = (interest: string) => {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(interest)
        ? f.interests.filter((i) => i !== interest)
        : [...f.interests, interest],
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await updateProfile(form);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save profile.");
    }
  };

  return (
    <div className="page-transition">
      <PageHeader eyebrow="Your account" title="Your membership" subtitle={`Signed in as ${profile.email}`} width="max-w-3xl" />
      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <MyRegistrations />
        <form onSubmit={(e) => void handleSave(e)} className="card p-6 sm:p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Field label="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div>
              <Field label="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
            <div>
              <Field label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <Field label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div>
              <Field label="Occupation" value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} />
            </div>
            <div>
              <Field label="University" value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} />
            </div>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold">Interests</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {INTERESTS.map((interest) => (
                <label key={interest} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.interests.includes(interest)} onChange={() => toggleInterest(interest)} className="accent-brand-blue" />
                  {interest}
                </label>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.newsletter} onChange={(e) => setForm({ ...form, newsletter: e.target.checked })} className="accent-brand-blue" />
            Receive the weekly newsletter
          </label>
          {error && <p className="text-sm text-brand-red-dark">{error}</p>}
          {saved && <p role="status" className="text-sm font-semibold text-[#2c6638]">Saved.</p>}
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="btn btn-blue">Save changes</button>
            {isStaff && (
              <>
                <Link to="/admin/news" className="btn btn-outline">Open newsroom</Link>
                <Link to="/admin/events" className="btn btn-outline">Manage events</Link>
              </>
            )}
            <button type="button" onClick={() => void signOut()} className="btn btn-outline">
              Log out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

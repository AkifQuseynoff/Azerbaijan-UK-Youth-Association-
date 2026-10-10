import { useState } from "react";
import { Link } from "react-router-dom";
import FlagDivider from "../components/FlagDivider";
import { useAuth } from "../context/AuthContext";

const interestOptions = [
  "Cultural events", "Language classes", "Career networking", "Scholarship opportunities",
  "Mentorship", "Volunteering", "Sports & recreation", "Arts & music",
];

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
    <div className="page-transition min-h-screen bg-[#F4F6FB]">
      <div className="bg-[#002060] py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-blue-200 text-sm mb-2">Signed in as {profile.email}</p>
          <h1 className="text-5xl text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Your membership
          </h1>
        </div>
      </div>
      <FlagDivider />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <form onSubmit={(e) => void handleSave(e)} className="bg-white rounded-2xl p-8 border border-gray-100 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">First name</label>
              <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Last name</label>
              <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">City</label>
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Occupation</label>
              <input value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">University</label>
              <input value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-3">Interests</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {interestOptions.map((interest) => (
                <label key={interest} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.interests.includes(interest)} onChange={() => toggleInterest(interest)} className="accent-[#003580]" />
                  {interest}
                </label>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.newsletter} onChange={(e) => setForm({ ...form, newsletter: e.target.checked })} className="accent-[#003580]" />
            Receive the weekly newsletter
          </label>
          {error && <p className="text-[#CC2229] text-sm">{error}</p>}
          {saved && <p className="text-[#00997A] text-sm">Saved.</p>}
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="px-6 py-3 bg-[#003580] text-white font-semibold rounded-xl">Save changes</button>
            {isStaff && (
              <Link to="/admin/news" className="px-6 py-3 bg-[#00997A] text-white font-semibold rounded-xl">Open newsroom</Link>
            )}
            <button type="button" onClick={() => void signOut()} className="px-6 py-3 border border-gray-300 rounded-xl font-semibold">
              Log out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

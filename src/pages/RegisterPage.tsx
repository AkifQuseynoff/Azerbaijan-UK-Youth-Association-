import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FlagDivider from "../components/FlagDivider";
import { useAuth } from "../context/AuthContext";
import { ageFromDob, isValidEmail, passwordIssues } from "../lib/validation";

const interestOptions = [
  "Cultural events", "Language classes", "Career networking", "Scholarship opportunities",
  "Mentorship", "Volunteering", "Sports & recreation", "Arts & music",
];

export default function RegisterPage() {
  const { signUp, profile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dob: "",
    city: "",
    occupation: "",
    university: "",
    interests: [] as string[],
    heardFrom: "",
    newsletter: true,
    terms: false,
  });

  useEffect(() => {
    if (profile && !confirmation) {
      navigate("/account", { replace: true });
    }
  }, [profile, confirmation, navigate]);

  const handleInterest = (interest: string) => {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(interest)
        ? f.interests.filter((i) => i !== interest)
        : [...f.interests, interest],
    }));
  };

  const validateStep1 = (): string | null => {
    if (!form.firstName.trim() || !form.lastName.trim()) return "Please enter your full name.";
    if (!isValidEmail(form.email)) return "Please enter a valid email address.";
    const pw = passwordIssues(form.password);
    if (pw.length) return `Password needs ${pw.join(", ")}.`;
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    const age = ageFromDob(form.dob);
    if (age === null) return "Please enter your date of birth.";
    if (age < 16) return "Membership is open to people aged 16 and over.";
    if (!form.city) return "Please select your city.";
    return null;
  };

  const goNext = () => {
    const message = validateStep1();
    if (message) {
      setError(message);
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.terms) {
      setError("Please accept the Terms of Membership and Privacy Policy.");
      return;
    }
    setPending(true);
    setError("");
    try {
      const result = await signUp({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
        dateOfBirth: form.dob,
        city: form.city,
        occupation: form.occupation.trim(),
        university: form.university.trim(),
        heardFrom: form.heardFrom,
        newsletter: form.newsletter,
        interests: form.interests,
      });
      if (result.needsConfirmation) {
        setConfirmation(true);
      } else {
        navigate("/account");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setPending(false);
    }
  };

  if (confirmation) {
    return (
      <div className="page-transition min-h-screen bg-[#F4F6FB] flex items-center justify-center px-6 py-24">
        <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md w-full text-center">
          <h2 className="text-3xl text-[#0D1B2A] mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Check your inbox
          </h2>
          <p className="text-gray-600 leading-relaxed mb-8">
            We sent a confirmation email to <strong>{form.email}</strong>. Confirm your address, then log in to open your member account.
          </p>
          <Link to="/login" className="text-[#003580] font-semibold">Go to log in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition min-h-screen bg-[#F4F6FB]">
      <div className="bg-[#002060] py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#CC2229] font-semibold text-sm uppercase tracking-wider mb-3">Membership</p>
          <h1 className="text-5xl text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>
            Join our community
          </h1>
          <p className="text-blue-200 mt-3 text-lg">Free membership · Takes 3 minutes</p>
        </div>
      </div>
      <FlagDivider />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-10">
          {([1, 2, 3] as const).map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                step === s ? "bg-[#003580] text-white shadow-md" :
                step > s ? "bg-[#00997A] text-white" : "bg-gray-200 text-gray-500"
              }`}>
                {s}
              </div>
              <span className={`text-sm font-medium ${step >= s ? "text-[#003580]" : "text-gray-400"} hidden sm:block`}>
                {s === 1 ? "Personal details" : s === 2 ? "Your interests" : "Confirm"}
              </span>
              {s < 3 && <div className={`flex-1 h-0.5 w-10 ${step > s ? "bg-[#00997A]" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={(e) => void handleSubmit(e)}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-[#0D1B2A] mb-6" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  Personal details
                </h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">First name *</label>
                    <input required type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Last name *</label>
                    <input required type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address *</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
                    <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm" autoComplete="new-password" />
                    <p className="text-xs text-gray-400 mt-1">At least 8 characters, with upper, lower, and a number.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm password *</label>
                    <input required type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm" autoComplete="new-password" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone number</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of birth *</label>
                    <input required type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm" />
                    <p className="text-xs text-gray-400 mt-1">You must be 16 or over. If you are 16 or 17, a parent or guardian should review our privacy notice with you.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">City in the UK *</label>
                    <select required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm bg-white">
                      <option value="">Select city</option>
                      {["London", "Manchester", "Birmingham", "Edinburgh", "Cardiff", "Leeds", "Glasgow", "Bristol", "Other"].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Occupation</label>
                    <input type="text" value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">University (if applicable)</label>
                    <input type="text" value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-[#0D1B2A] mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  Your interests
                </h2>
                <p className="text-gray-500 text-sm mb-6">Select all that apply — helps us tailor what we send you.</p>
                <div className="grid sm:grid-cols-2 gap-3 mb-8">
                  {interestOptions.map((interest) => (
                    <label
                      key={interest}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer ${
                        form.interests.includes(interest) ? "border-[#00997A] bg-teal-50" : "border-gray-200"
                      }`}
                    >
                      <input type="checkbox" className="accent-[#00997A]" checked={form.interests.includes(interest)} onChange={() => handleInterest(interest)} />
                      <span className="text-sm font-medium text-gray-700">{interest}</span>
                    </label>
                  ))}
                </div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">How did you hear about us?</label>
                <select value={form.heardFrom} onChange={(e) => setForm({ ...form, heardFrom: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm bg-white">
                  <option value="">Select an option</option>
                  <option>Friend or family member</option>
                  <option>Social media (Instagram)</option>
                  <option>Social media (Facebook)</option>
                  <option>University / college</option>
                  <option>Google search</option>
                  <option>Attended an event</option>
                  <option>Other</option>
                </select>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-[#0D1B2A] mb-6" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  Confirm your registration
                </h2>
                <div className="bg-[#F4F6FB] rounded-xl p-6 mb-6 space-y-3">
                  {[
                    { label: "Name", value: `${form.firstName} ${form.lastName}` },
                    { label: "Email", value: form.email },
                    { label: "City", value: form.city },
                    { label: "Membership", value: "Standard Member (Free)" },
                    { label: "Interests", value: form.interests.length > 0 ? form.interests.join(", ") : "None selected" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-4 text-sm">
                      <span className="text-gray-500 w-28 flex-shrink-0">{label}</span>
                      <span className="text-[#0D1B2A] font-medium">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.newsletter} onChange={(e) => setForm({ ...form, newsletter: e.target.checked })} className="mt-0.5 accent-[#003580]" />
                    <span className="text-sm text-gray-600">Send me our newsletter with events, news, and opportunities (max once per week).</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" required checked={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.checked })} className="mt-0.5 accent-[#003580]" />
                    <span className="text-sm text-gray-600">
                      I agree to the <Link to="/terms" className="text-[#003580] underline">Terms of Membership</Link> and{" "}
                      <Link to="/privacy" className="text-[#003580] underline">Privacy Policy</Link>.
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {error && <p className="text-[#CC2229] text-sm mt-4">{error}</p>}

          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <button type="button" onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)} className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 font-semibold">
                Back
              </button>
            ) : <div />}
            {step === 1 && (
              <button type="button" onClick={goNext} className="px-8 py-3 bg-[#003580] text-white font-semibold rounded-xl">
                Continue
              </button>
            )}
            {step === 2 && (
              <button type="button" onClick={() => setStep(3)} className="px-8 py-3 bg-[#003580] text-white font-semibold rounded-xl">
                Continue
              </button>
            )}
            {step === 3 && (
              <button type="submit" disabled={pending} className="px-8 py-3 bg-[#CC2229] text-white font-semibold rounded-xl disabled:opacity-50">
                {pending ? "Submitting…" : "Complete Registration"}
              </button>
            )}
          </div>
        </form>
        <p className="text-sm text-gray-500 mt-8">
          Already a member? <Link to="/login" className="text-[#003580] font-semibold">Log in</Link>
        </p>
      </div>
    </div>
  );
}

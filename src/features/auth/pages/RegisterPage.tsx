import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/ui/PageHeader";
import { useAuth } from "../AuthContext";
import { CITIES, HEARD_FROM_OPTIONS, INTERESTS } from "../../../constants";
import { Field, SelectField } from "../../../components/ui/Field";
import { ageFromDob, isValidEmail, passwordIssues } from "../../../lib/validation";

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
    newsletter: false,
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
        termsAccepted: form.terms,
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
      <div className="page-transition flex min-h-[60vh] items-center justify-center px-5 py-24">
        <div className="card w-full max-w-md p-10 text-center">
          <h2 className="display mb-4 text-3xl">
            Check your inbox
          </h2>
          <p className="text-mute leading-relaxed mb-8">
            We sent a confirmation email to <strong>{form.email}</strong>. Confirm your address, then log in to open your member account.
          </p>
          <Link to="/login" className="text-brand-blue font-semibold">Go to log in</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition">
      <PageHeader eyebrow="Membership" title="Join our community" subtitle="Free membership · Takes 3 minutes" width="max-w-3xl" />

      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <div className="flex items-center gap-3 mb-10">
          {([1, 2, 3] as const).map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                step === s ? "bg-brand-blue text-white" :
                step > s ? "bg-brand-green text-white" : "bg-mist text-mute"
              }`}>
                {s}
              </div>
              <span className={`text-sm font-medium ${step >= s ? "text-brand-blue" : "text-mute"} hidden sm:block`}>
                {s === 1 ? "Personal details" : s === 2 ? "Your interests" : "Confirm"}
              </span>
              {s < 3 && <div className={`flex-1 h-0.5 w-10 ${step > s ? "bg-brand-green" : "bg-line"}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={(e) => void handleSubmit(e)}>
          <div className="card p-6 sm:p-8">
            {step === 1 && (
              <div>
                <h2 className="display mb-6 text-3xl">
                  Personal details
                </h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <Field label="First name *" required type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                  </div>
                  <div>
                    <Field label="Last name *" required type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Email address *" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div>
                    <Field label="Password *" required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="new-password" />
                    <p className="text-xs text-mute mt-1">At least 8 characters, with upper, lower, and a number.</p>
                  </div>
                  <div>
                    <Field label="Confirm password *" required type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} autoComplete="new-password" />
                  </div>
                  <div>
                    <Field label="Phone number" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div>
                    <Field label="Date of birth *" required type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} />
                    <p className="text-xs text-mute mt-1">You must be 16 or over. If you are 16 or 17, a parent or guardian should review our privacy notice with you.</p>
                  </div>
                  <div>
                    <SelectField label="City in the UK *" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} options={CITIES} placeholder="Select city" />
                  </div>
                  <div>
                    <Field label="Occupation" type="text" value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="University (if applicable)" type="text" value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="display mb-2 text-3xl">
                  Your interests
                </h2>
                <p className="text-mute text-sm mb-6">Select all that apply — helps us tailor what we send you.</p>
                <div className="grid sm:grid-cols-2 gap-3 mb-8">
                  {INTERESTS.map((interest) => (
                    <label
                      key={interest}
                      className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition-colors ${
                        form.interests.includes(interest) ? "border-brand-green bg-brand-green/10" : "border-line hover:border-brand-sky/50"
                      }`}
                    >
                      <input type="checkbox" className="accent-brand-green" checked={form.interests.includes(interest)} onChange={() => handleInterest(interest)} />
                      <span className="text-sm font-semibold text-ink">{interest}</span>
                    </label>
                  ))}
                </div>
                <SelectField label="How did you hear about us?" value={form.heardFrom} onChange={(e) => setForm({ ...form, heardFrom: e.target.value })} options={HEARD_FROM_OPTIONS} placeholder="Select an option" />
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="display mb-6 text-3xl">
                  Confirm your registration
                </h2>
                <div className="mb-6 space-y-3 rounded-2xl bg-paper p-6">
                  {[
                    { label: "Name", value: `${form.firstName} ${form.lastName}` },
                    { label: "Email", value: form.email },
                    { label: "City", value: form.city },
                    { label: "Membership", value: "Standard Member (Free)" },
                    { label: "Interests", value: form.interests.length > 0 ? form.interests.join(", ") : "None selected" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-4 text-sm">
                      <span className="text-mute w-28 flex-shrink-0">{label}</span>
                      <span className="font-semibold text-ink">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.newsletter} onChange={(e) => setForm({ ...form, newsletter: e.target.checked })} className="mt-0.5 accent-brand-blue" />
                    <span className="text-sm text-mute">Send me our newsletter with events, news, and opportunities (max once per week).</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" required checked={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.checked })} className="mt-0.5 accent-brand-blue" />
                    <span className="text-sm text-mute">
                      I agree to the <Link to="/terms" className="text-brand-blue underline">Terms of Membership</Link> and{" "}
                      <Link to="/privacy" className="text-brand-blue underline">Privacy Policy</Link>.
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {error && <p className="text-sm text-brand-red-dark mt-4">{error}</p>}

          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <button type="button" onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)} className="btn btn-outline">
                Back
              </button>
            ) : <div />}
            {step === 1 && (
              <button type="button" onClick={goNext} className="btn btn-blue">
                Continue
              </button>
            )}
            {step === 2 && (
              <button type="button" onClick={() => setStep(3)} className="btn btn-blue">
                Continue
              </button>
            )}
            {step === 3 && (
              <button type="submit" disabled={pending} className="btn btn-primary">
                {pending ? "Submitting…" : "Complete Registration"}
              </button>
            )}
          </div>
        </form>
        <p className="mt-8 text-sm text-mute">
          Already a member? <Link to="/login" className="text-brand-blue font-semibold">Log in</Link>
        </p>
      </div>
    </div>
  );
}

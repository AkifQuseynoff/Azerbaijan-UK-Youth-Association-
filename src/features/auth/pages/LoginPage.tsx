import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Field } from "../../../components/ui/Field";
import PageHeader from "../../../components/ui/PageHeader";
import { useAuth } from "../AuthContext";

export default function LoginPage() {
  const { signIn, demo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || "/account";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError("");
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not log in.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="page-transition">
      <PageHeader eyebrow="Members" title="Log in" width="max-w-md" />
      <div className="max-w-md mx-auto px-6 py-12">
        <form onSubmit={(e) => void handleSubmit(e)} className="card p-6 sm:p-8 space-y-5">
          <div>
            <Field label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div>
            <Field label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
          {error && <p className="text-sm text-brand-red-dark">{error}</p>}
          <button type="submit" disabled={pending} className="btn btn-blue w-full">
            {pending ? "Signing in…" : "Log in"}
          </button>
          <p className="text-sm text-mute text-center">
            <Link to="/forgot-password" className="text-brand-blue font-semibold">Forgot password?</Link>
          </p>
        </form>
        <p className="text-sm text-mute mt-6 text-center">
          New here? <Link to="/register" className="text-brand-blue font-semibold">Join the Association</Link>
        </p>
        {demo && (
          <p className="text-xs text-mute mt-6 text-center">
            Preview mode: staff demo is editor@aukya.org.uk / Editor123!
          </p>
        )}
      </div>
    </div>
  );
}

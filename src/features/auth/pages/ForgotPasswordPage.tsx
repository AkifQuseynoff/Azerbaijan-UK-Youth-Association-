import { useState } from "react";
import { Link } from "react-router-dom";
import { Field } from "../../../components/ui/Field";
import PageHeader from "../../../components/ui/PageHeader";
import { useAuth } from "../AuthContext";

export default function ForgotPasswordPage() {
  const { requestPasswordReset, configured } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset email.");
    }
  };

  return (
    <div className="page-transition">
      <PageHeader title="Reset password" width="max-w-md" />
      <div className="max-w-md mx-auto px-6 py-12">
        {sent ? (
          <div className="card p-6 sm:p-8">
            <p className="text-mute mb-4">If that email is registered, we have sent reset instructions.</p>
            {!configured && (
              <p className="text-sm text-mute mb-4">
                Preview mode: continue to <Link to="/reset-password" className="text-brand-blue font-semibold">set a new password</Link>.
              </p>
            )}
            <Link to="/login" className="text-brand-blue font-semibold">Back to log in</Link>
          </div>
        ) : (
          <form onSubmit={(e) => void handleSubmit(e)} className="card p-6 sm:p-8 space-y-5">
            <div><Field label="Email address" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></div>
            {error && <p className="text-sm text-brand-red-dark">{error}</p>}
            <button type="submit" className="btn btn-blue w-full">Send reset link</button>
          </form>
        )}
      </div>
    </div>
  );
}

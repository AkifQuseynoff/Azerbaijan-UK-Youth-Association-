import { useState } from "react";
import { Link } from "react-router-dom";
import FlagDivider from "../components/FlagDivider";
import { useAuth } from "../context/AuthContext";

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
    <div className="page-transition min-h-screen bg-[#F4F6FB]">
      <div className="bg-[#002060] py-16 px-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>Reset password</h1>
        </div>
      </div>
      <FlagDivider />
      <div className="max-w-md mx-auto px-6 py-12">
        {sent ? (
          <div className="bg-white rounded-2xl p-8 border border-gray-100">
            <p className="text-gray-600 mb-4">If that email is registered, we have sent reset instructions.</p>
            {!configured && (
              <p className="text-sm text-gray-500 mb-4">
                Preview mode: continue to <Link to="/reset-password" className="text-[#003580] font-semibold">set a new password</Link>.
              </p>
            )}
            <Link to="/login" className="text-[#003580] font-semibold">Back to log in</Link>
          </div>
        ) : (
          <form onSubmit={(e) => void handleSubmit(e)} className="bg-white rounded-2xl p-8 border border-gray-100 space-y-5">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm" />
            {error && <p className="text-[#CC2229] text-sm">{error}</p>}
            <button type="submit" className="w-full py-3 bg-[#003580] text-white font-semibold rounded-xl">Send reset link</button>
          </form>
        )}
      </div>
    </div>
  );
}

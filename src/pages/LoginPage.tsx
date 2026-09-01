import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FlagDivider from "../components/FlagDivider";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { signIn, configured } = useAuth();
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
    <div className="page-transition min-h-screen bg-[#F4F6FB]">
      <div className="bg-[#002060] py-16 px-6">
        <div className="max-w-md mx-auto">
          <p className="text-[#CC2229] font-semibold text-sm uppercase tracking-wider mb-3">Members</p>
          <h1 className="text-5xl text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>Log in</h1>
        </div>
      </div>
      <FlagDivider />
      <div className="max-w-md mx-auto px-6 py-12">
        <form onSubmit={(e) => void handleSubmit(e)} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm" autoComplete="email" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm" autoComplete="current-password" />
          </div>
          {error && <p className="text-[#CC2229] text-sm">{error}</p>}
          <button type="submit" disabled={pending} className="w-full py-3 bg-[#003580] text-white font-semibold rounded-xl disabled:opacity-50">
            {pending ? "Signing in…" : "Log in"}
          </button>
          <p className="text-sm text-gray-500 text-center">
            <Link to="/forgot-password" className="text-[#003580] font-semibold">Forgot password?</Link>
          </p>
        </form>
        <p className="text-sm text-gray-500 mt-6 text-center">
          New here? <Link to="/register" className="text-[#003580] font-semibold">Join the Association</Link>
        </p>
        {!configured && (
          <p className="text-xs text-gray-400 mt-6 text-center">
            Preview mode: staff demo is editor@aukya.org.uk / Editor123!
          </p>
        )}
      </div>
    </div>
  );
}

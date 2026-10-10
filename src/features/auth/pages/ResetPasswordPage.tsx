import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Field } from "../../../components/ui/Field";
import FlagDivider from "../../../components/ui/FlagDivider";
import { useAuth } from "../AuthContext";
import { passwordIssues } from "../../../lib/validation";

export default function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const issues = passwordIssues(password);
    if (issues.length) {
      setError(`Password needs ${issues.join(", ")}.`);
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await updatePassword(password);
      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update password.");
    }
  };

  return (
    <div className="page-transition min-h-screen bg-[#F4F6FB]">
      <div className="bg-[#002060] py-16 px-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl text-white" style={{ fontFamily: "'DM Serif Display', serif" }}>Choose a new password</h1>
        </div>
      </div>
      <FlagDivider />
      <div className="max-w-md mx-auto px-6 py-12">
        <form onSubmit={(e) => void handleSubmit(e)} className="bg-white rounded-2xl p-8 border border-gray-100 space-y-5">
          <div><Field label="New password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" /></div>
          <div><Field label="Confirm password" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" /></div>
          {error && <p className="text-[#CC2229] text-sm">{error}</p>}
          <button type="submit" className="w-full py-3 bg-[#003580] text-white font-semibold rounded-xl">Update password</button>
          <Link to="/login" className="block text-center text-sm text-[#003580]">Cancel</Link>
        </form>
      </div>
    </div>
  );
}

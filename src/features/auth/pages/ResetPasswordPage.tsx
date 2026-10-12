import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Field } from "../../../components/ui/Field";
import PageHeader from "../../../components/ui/PageHeader";
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
    <div className="page-transition">
      <PageHeader title="Choose a new password" width="max-w-md" />
      <div className="max-w-md mx-auto px-6 py-12">
        <form onSubmit={(e) => void handleSubmit(e)} className="card p-6 sm:p-8 space-y-5">
          <div><Field label="New password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" /></div>
          <div><Field label="Confirm password" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" /></div>
          {error && <p className="text-sm text-brand-red-dark">{error}</p>}
          <button type="submit" className="btn btn-blue w-full">Update password</button>
          <Link to="/login" className="block text-center text-sm text-brand-blue">Cancel</Link>
        </form>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import PasswordField from "../components/PasswordField";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
      else setError("Invalid or expired reset link.");
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess("Password updated successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError(err?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center theme-bg px-4">
      <div className="w-full max-w-md rounded-2xl border theme-border theme-surface p-8 shadow-sm">
        <h1 className="text-2xl font-bold theme-text">Set new password</h1>
        <p className="mt-1 text-sm theme-text-muted">Enter your new password below.</p>
        {!ready && error ? (
          <p className="mt-4 text-sm text-red-500">{error}</p>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <PasswordField label="New Password" value={password} onChange={setPassword} />
            <PasswordField label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} />
            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-green-500">{success}</p>}
            <button type="submit" disabled={loading} className="w-full rounded-lg bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60">{loading ? "Updating..." : "Update password"}</button>
          </form>
        )}
      </div>
    </div>
  );
}
import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setMessage("Password reset email sent. Check your inbox.");
    } catch (err: any) {
      setError(err?.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center theme-bg px-4">
      <div className="w-full max-w-md rounded-2xl border theme-border theme-surface p-8 shadow-sm">
        <h1 className="text-2xl font-bold theme-text">Forgot password</h1>
        <p className="mt-1 text-sm theme-text-muted">Enter your email to receive a reset link.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium theme-text-muted">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border theme-border theme-surface-alt px-3 py-2 text-sm theme-text focus:border-indigo-500 focus:outline-none" />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {message && <p className="text-sm text-green-500">{message}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60">{loading ? "Sending..." : "Send reset link"}</button>
        </form>
        <p className="mt-4 text-center text-sm theme-text-muted">
          <Link to="/login" className="font-medium text-indigo-500 hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
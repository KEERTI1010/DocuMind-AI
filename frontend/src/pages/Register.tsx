import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth";
import PasswordField from "../components/PasswordField";
import logoImg from "../assets/Logo.png";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
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
      await registerUser(fullName, email, password);
      navigate("/verify-success", { state: { email } });
    } catch (err: any) {
      const message = err?.response?.data?.error || err?.message || "Registration failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-theme-bg px-4">
      <div className="w-full max-w-md rounded-2xl border theme-border bg-theme-surface p-8 theme-shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <img src={logoImg} alt="DocuMind AI logo" className="h-7 w-auto" />
        </div>
        <h1 className="text-2xl font-bold theme-text">Create account</h1>
        <p className="mt-1 text-sm theme-text-muted">Join DocuMind AI</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium theme-text">Full Name</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 w-full rounded-lg border theme-border theme-surface-alt px-3 py-2 text-sm theme-text focus:border-theme-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium theme-text">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border theme-border theme-surface-alt px-3 py-2 text-sm theme-text focus:border-theme-primary focus:outline-none" />
          </div>
          <PasswordField label="Password" value={password} onChange={setPassword} />
          <PasswordField label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-lg theme-primary py-2 font-medium text-white hover:theme-primary-hover disabled:opacity-60">{loading ? "Creating..." : "Create Account"}</button>
        </form>
        <p className="mt-4 text-center text-sm theme-text-muted">
          Already have an account? <Link to="/login" className="font-medium theme-primary-text hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
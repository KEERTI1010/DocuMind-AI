import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import PasswordField from "../components/PasswordField";
import logoFull from "../assets/logo-full.svg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await loginUser(email, password);
      login(data.access_token, data.refresh_token, data.user);
      navigate("/documents");
    } catch (err: any) {
      const message = err?.response?.data?.error || err?.message || "Login failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-theme-bg px-4">
      <div className="w-full max-w-md rounded-2xl border theme-border bg-theme-surface p-8 theme-shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <img src={logoFull} alt="DocuMind AI logo" className="h-7 w-auto" />
        </div>
        <h1 className="text-2xl font-bold theme-text">Welcome back</h1>
        <p className="mt-1 text-sm theme-text-muted">Sign in to DocuMind AI</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium theme-text">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border theme-border theme-surface-alt px-3 py-2 text-sm theme-text focus:border-theme-primary focus:outline-none" />
          </div>
          <PasswordField label="Password" value={password} onChange={setPassword} />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-lg theme-primary py-2 font-medium text-white hover:theme-primary-hover disabled:opacity-60">{loading ? "Signing in..." : "Sign In"}</button>
        </form>
        <p className="mt-4 text-center text-sm">
          <Link to="/forgot-password" className="font-medium theme-primary-text hover:underline">Forgot password?</Link>
        </p>
        <p className="mt-2 text-center text-sm theme-text-muted">
          No account? <Link to="/register" className="font-medium theme-primary-text hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}
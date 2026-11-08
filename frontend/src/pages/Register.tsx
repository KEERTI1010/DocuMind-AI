import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth";
import PasswordField from "../components/PasswordField";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    setSuccess("");
    try {
      await registerUser(fullName, email, password);
      setSuccess("Registration successful. Please log in.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err: any) {
      const message = err?.response?.data?.error || err?.message || "Registration failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
        <p className="mt-1 text-sm text-slate-500">Join DocuMind AI</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700">Full Name</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none" />
          </div>
          <PasswordField label="Password" value={password} onChange={setPassword} />
          <PasswordField label="Confirm Password" value={confirmPassword} onChange={setConfirmPassword} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60">{loading ? "Creating..." : "Create Account"}</button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account? <Link to="/login" className="font-medium text-indigo-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

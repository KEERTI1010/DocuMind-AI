import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, resendVerificationEmail } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import { Mail, Loader2, AlertCircle } from "lucide-react";
import PasswordField from "../components/PasswordField";
import logoImg from "../assets/Logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState("");
  const [showUnverified, setShowUnverified] = useState(false);
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
    setShowUnverified(false);
    try {
      const data = await loginUser(email, password);
      login(data.access_token, data.refresh_token, data.user);
      navigate("/documents");
    } catch (err: any) {
      const message = err?.response?.data?.error || err?.message || "Login failed.";
      setError(message);
      if (message.toLowerCase().includes("unverified") || message.toLowerCase().includes("email not confirmed") || message.toLowerCase().includes("email not verified")) {
        setShowUnverified(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resending || !email.trim()) return;
    setResending(true);
    setResendError("");
    setResendMessage("");
    try {
      await resendVerificationEmail(email);
      setResendMessage("Verification email sent! Check your inbox.");
    } catch (err: any) {
      setResendError(err?.message || "Failed to send. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-theme-bg px-4">
      <div className="w-full max-w-md rounded-2xl border theme-border bg-theme-surface p-8 theme-shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <img src={logoImg} alt="DocuMind AI logo" className="h-7 w-auto" />
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
          {showUnverified && (
            <div className="rounded-xl bg-theme-accent-pink-soft p-4 border border-theme-accent-pink-border">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 theme-accent-pink-text mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium theme-text">Your email isn&apos;t verified yet! 💜</p>
                  <p className="mt-1 text-sm theme-text-muted">
                    Please check your inbox and confirm your email address before signing in.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resending || !email.trim()}
                      className="flex-1 rounded-lg border-2 border-theme-border bg-theme-surface px-3 py-2 text-sm font-medium theme-text hover:border-theme-primary hover:theme-primary-text disabled:opacity-60"
                    >
                      {resending ? (
                        <>
                          <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                        </>
                      ) : (
                        <>
                          <Mail className="inline h-4 w-4 mr-2" />
                          Resend Verification Email
                        </>
                      )}
                    </button>
                  </div>
                  {resendMessage && <p className="mt-2 text-xs theme-success">{resendMessage}</p>}
                  {resendError && <p className="mt-2 text-xs text-red-500">{resendError}</p>}
                  <p className="mt-2 text-xs theme-text-muted flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Didn&apos;t see it? Check your Spam or Junk folder.
                  </p>
                </div>
              </div>
            </div>
          )}
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
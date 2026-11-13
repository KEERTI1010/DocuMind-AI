import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import FadeIn from "../components/FadeIn";

interface LocationState {
  email?: string;
}

export default function EmailVerificationSuccess() {
  const location = useLocation();
  const state = location.state as LocationState;
  const email = state?.email || "your email";

  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((c) => c - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (resending || cooldown > 0) return;
    setResending(true);
    setResendError("");
    setResendMessage("");
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send");
      setResendMessage("Verification email sent! Check your inbox.");
      setCooldown(60);
    } catch (err: any) {
      setResendError(err?.message || "Failed to send. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-theme-bg px-4">
      <div className="w-full max-w-md">
        <FadeIn>
          <div className="rounded-2xl border theme-border bg-theme-surface p-8 theme-shadow-sm text-center">
            <div className="mx-auto mb-6">
              <div className="relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-theme-accent-pink-soft">
                <CheckCircle className="h-10 w-10 theme-accent-pink-text" />
              </div>
            </div>
            <h1 className="text-2xl font-bold theme-text">You&apos;re almost there! 💜</h1>
            <p className="mt-2 text-lg theme-primary-text">Verify your email address</p>
            <p className="mt-4 text-sm theme-text-muted">
              Your DocuMind AI account has been created successfully. We&apos;ve sent a verification link to
            </p>
            <p className="mt-1 font-medium theme-text break-all">{email}</p>

            <div className="mt-6 rounded-xl bg-theme-accent-soft p-5 text-left">
              <p className="text-sm font-medium theme-text mb-3">What&apos;s next?</p>
              <ol className="space-y-2 text-sm theme-text-muted">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-theme-primary text-white text-xs flex items-center justify-center font-medium">1</span>
                  Open your email inbox.
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-theme-primary text-white text-xs flex items-center justify-center font-medium">2</span>
                  Find the DocuMind AI verification email.
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-theme-primary text-white text-xs flex items-center justify-center font-medium">3</span>
                  Click the confirmation link.
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-theme-primary text-white text-xs flex items-center justify-center font-medium">4</span>
                  Return to DocuMind AI and sign in.
                </li>
              </ol>
              <p className="mt-4 text-xs theme-text-muted flex items-center gap-1">
                <Mail className="h-3 w-3" />
                Didn&apos;t see it? Check your Spam or Junk folder.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <Link
                to="/login"
                className="block w-full rounded-xl theme-primary-gradient px-6 py-3 text-base font-semibold text-white shadow-lg shadow-theme-accent-soft transition hover:theme-primary-hover hover:shadow-theme-accent-soft"
              >
                Got it! Go to Sign In
              </Link>

              <button
                onClick={handleResend}
                disabled={resending || cooldown > 0}
                className="w-full rounded-xl border-2 border-theme-border bg-theme-surface px-6 py-3 text-base font-semibold theme-text shadow-sm transition hover:border-theme-primary hover:theme-primary-text hover:theme-shadow disabled:opacity-60"
              >
                {resending ? (
                  <>
                    <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                  </>
                ) : cooldown > 0 ? (
                  `Resend in ${cooldown}s`
                ) : (
                  <>
                    <Mail className="inline h-4 w-4 mr-2" />
                    Resend verification email
                  </>
                )}
              </button>
              {resendMessage && <p className="text-sm theme-success">{resendMessage}</p>}
              {resendError && <p className="text-sm text-red-500">{resendError}</p>}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import FadeIn from "../components/FadeIn";
import { supabase } from "../services/supabase";

export default function EmailVerificationCallback() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleVerification = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (data.session) {
          setStatus("success");
          setMessage("Email verified successfully! You can now sign in to DocuMind AI.");
        } else {
          const { data: urlData, error: urlError } = await supabase.auth.getUser();

          if (urlError || !urlData.user) {
            throw new Error("Invalid or expired verification link");
          }

          if (urlData.user.email_confirmed_at) {
            setStatus("success");
            setMessage("Email verified successfully! You can now sign in to DocuMind AI.");
          } else {
            throw new Error("Email not yet verified");
          }
        }
      } catch (err: any) {
        setStatus("error");
        setMessage(err?.message || "This verification link is invalid or has expired. Please request a new one.");
      }
    };

    handleVerification();
  }, []);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-theme-bg px-4">
        <div className="w-full max-w-md rounded-2xl border theme-border bg-theme-surface p-8 theme-shadow-sm text-center">
          <div className="mx-auto mb-6">
            <Loader2 className="mx-auto h-10 w-10 animate-spin theme-primary-text" />
          </div>
          <h1 className="text-2xl font-bold theme-text">Verifying your email...</h1>
          <p className="mt-2 text-sm theme-text-muted">Please wait while we confirm your account.</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-theme-bg px-4">
        <div className="w-full max-w-md">
          <FadeIn>
            <div className="rounded-2xl border theme-border bg-theme-surface p-8 theme-shadow-sm text-center">
              <div className="mx-auto mb-6">
                <div className="relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-theme-accent-mint-soft">
                  <CheckCircle className="h-10 w-10 theme-accent-mint-text" />
                </div>
              </div>
              <h1 className="text-2xl font-bold theme-text">Email Verified! 🎉</h1>
              <p className="mt-2 text-lg theme-primary-text">Your account is ready</p>
              <p className="mt-4 text-sm theme-text-muted">{message}</p>
              <Link
                to="/login"
                className="mt-8 block w-full rounded-xl theme-primary-gradient px-6 py-3 text-base font-semibold text-white shadow-lg shadow-theme-accent-soft transition hover:theme-primary-hover hover:shadow-theme-accent-soft"
              >
                Continue to Sign In
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-theme-bg px-4">
      <div className="w-full max-w-md">
        <FadeIn>
          <div className="rounded-2xl border theme-border bg-theme-surface p-8 theme-shadow-sm text-center">
            <div className="mx-auto mb-6">
              <div className="relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-theme-accent-pink-soft">
                <AlertCircle className="h-10 w-10 theme-accent-pink-text" />
              </div>
            </div>
            <h1 className="text-2xl font-bold theme-text">Verification Failed</h1>
            <p className="mt-2 text-lg theme-text-muted">Unable to verify your email</p>
            <p className="mt-4 text-sm theme-text-muted">{message}</p>
            <div className="mt-6 space-y-3">
              <Link
                to="/login"
                className="block w-full rounded-xl theme-primary-gradient px-6 py-3 text-base font-semibold text-white shadow-lg shadow-theme-accent-soft transition hover:theme-primary-hover hover:shadow-theme-accent-soft"
              >
                Go to Sign In
              </Link>
              <Link
                to="/register"
                className="block w-full rounded-xl border-2 border-theme-border bg-theme-surface px-6 py-3 text-base font-semibold theme-text shadow-sm transition hover:border-theme-primary hover:theme-primary-text hover:theme-shadow"
              >
                Create New Account
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
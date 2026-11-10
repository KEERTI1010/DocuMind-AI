import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import FadeIn from "../components/FadeIn";

export default function Settings() {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const confirmLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logout();
    } catch {
      // ignore
    } finally {
      setLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  useEffect(() => {
    gsap.fromTo(
      ".settings-card",
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" }
    );
  }, []);

  return (
    <div className="space-y-6">
      <FadeIn>
        <h1 className="text-2xl font-bold theme-text">Settings</h1>
      </FadeIn>

      <section className="settings-card rounded-xl border theme-border theme-surface p-6 theme-shadow">
        <h2 className="text-lg font-semibold theme-text">Profile</h2>
        {user ? (
          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300">
              <User className="h-7 w-7" />
            </div>
            <div>
              <p className="text-base font-medium theme-text">{user.email}</p>
              <p className="text-xs theme-text-muted">DocuMind AI account</p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm theme-text-muted">User profile is unavailable.</p>
        )}
      </section>

      <section className="settings-card rounded-xl border theme-border theme-surface p-6 theme-shadow">
        <h2 className="text-lg font-semibold theme-text">Security</h2>
        <div className="mt-4">
          <Link to="/forgot-password" className="text-sm font-medium text-indigo-500 hover:underline">Reset password</Link>
        </div>
      </section>

      <section className="settings-card rounded-xl border theme-border theme-surface p-6 theme-shadow">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </section>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl theme-surface p-6 shadow-lg">
            <h3 className="text-lg font-semibold theme-text">Confirm Logout</h3>
            <p className="mt-2 text-sm theme-text-muted">Are you sure you want to log out of DocuMind AI?</p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                disabled={loggingOut}
                className="flex-1 rounded-lg border theme-border theme-surface-alt px-4 py-2 text-sm font-medium theme-text hover:theme-surface disabled:opacity-60 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                disabled={loggingOut}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60 transition"
              >
                {loggingOut ? "Logging out..." : "Yes, Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
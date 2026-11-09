import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { LogOut, User, Palette } from "lucide-react";
import { Link } from "react-router-dom";

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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Profile</h2>
        {user ? (
          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <User className="h-7 w-7" />
            </div>
            <div>
              <p className="text-base font-medium text-slate-900">{user.email}</p>
              <p className="text-xs text-slate-500">DocuMind AI account</p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">User profile is unavailable.</p>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Account Preferences</h2>
        <div className="mt-4 flex items-center gap-3 text-sm text-slate-700">
          <Palette className="h-5 w-5 text-slate-400" />
          <span>Theme and notification preferences will be available soon.</span>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Security</h2>
        <div className="mt-4">
          <Link to="/forgot-password" className="text-sm font-medium text-indigo-600 hover:underline">Reset password</Link>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </section>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-900">Confirm Logout</h3>
            <p className="mt-2 text-sm text-slate-600">Are you sure you want to log out of DocuMind AI?</p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                disabled={loggingOut}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                disabled={loggingOut}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
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
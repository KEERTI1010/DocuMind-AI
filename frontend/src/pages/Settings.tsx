import { useAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";

export default function Settings() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Profile</h2>
        {user ? (
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            <p><span className="font-medium">User ID:</span> {user.id}</p>
            <p><span className="font-medium">Email:</span> {user.email}</p>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">User profile is unavailable in development preview mode.</p>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Account Preferences</h2>
        <p className="mt-2 text-sm text-slate-600">Theme and notification preferences will be available soon.</p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Security</h2>
        <div className="mt-4">
          <Link to="/forgot-password" className="text-sm font-medium text-indigo-600 hover:underline">Reset password</Link>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <button onClick={logout} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </section>
    </div>
  );
}

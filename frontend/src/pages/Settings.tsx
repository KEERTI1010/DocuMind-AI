import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { LogOut, Mail, Edit2 } from "lucide-react";
import { Link } from "react-router-dom";
import AvatarPicker from "../components/AvatarPicker";
import FadeIn from "../components/FadeIn";

export default function Settings() {
  const { user, logout, updateProfile } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  useEffect(() => {
    setDisplayName(user?.displayName || "");
  }, [user]);

  const handleSave = useCallback(async () => {
    if (!user) return;
    setSaving(true);
    setSaveError("");
    setSaveSuccess("");
    try {
      await updateProfile({
        displayName: displayName.trim() || undefined,
        avatarUrl: user.avatarUrl || undefined,
      });
      setSaveSuccess("Profile saved.");
      setEditingName(false);
      setTimeout(() => setSaveSuccess(""), 3000);
    } catch (err: any) {
      setSaveError(err?.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }, [user, updateProfile, displayName]);

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
    <div className="space-y-4">
      <FadeIn>
        <h1 className="text-2xl font-bold theme-text">Settings</h1>
      </FadeIn>

      <section className="rounded-xl border theme-border theme-surface p-4 theme-shadow">
        <FadeIn>
          <h2 className="text-lg font-semibold theme-text">Profile</h2>
        </FadeIn>
        {user ? (
          <div className="mt-4 space-y-4">
            <div>
              <AvatarPicker
                currentAvatarId={user.avatarUrl || null}
                onAvatarChange={(avatarId) => {
                  if (!user) return;
                  updateProfile({ avatarUrl: avatarId || undefined });
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium theme-text mb-2">Display name</label>
              {editingName ? (
                <div className="flex gap-2">
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="flex-1 rounded-xl border theme-border theme-surface-alt px-4 py-2.5 text-sm theme-text focus:border-theme-primary focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-xl theme-primary px-4 py-2.5 text-sm font-medium text-white hover:theme-primary-hover disabled:opacity-60 transition"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDisplayName(user.displayName || "");
                      setEditingName(false);
                    }}
                    className="rounded-xl border theme-border theme-surface-alt px-4 py-2.5 text-sm theme-text hover:theme-surface disabled:opacity-60 transition"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-base font-medium theme-text truncate">
                    {displayName || "No display name"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditingName(true)}
                    className="rounded-lg border theme-border theme-surface-alt px-3 py-1.5 text-xs theme-text-muted hover:theme-surface transition"
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>
                </div>
              )}
              {saveError && <p className="mt-1 text-sm text-red-500">{saveError}</p>}
              {saveSuccess && <p className="mt-1 text-sm theme-success">{saveSuccess}</p>}
            </div>

            <div className="flex items-center gap-3 pt-3 border-t theme-border">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 theme-text-muted" />
                <div>
                  <p className="text-sm font-medium theme-text">Email address</p>
                  <p className="text-xs theme-text-muted">{user.email}</p>
                </div>
              </div>
              <span className="text-xs font-medium theme-primary-text">Read-only</span>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm theme-text-muted">User profile is unavailable.</p>
        )}
      </section>

      <section className="rounded-xl border theme-border theme-surface p-4 theme-shadow">
        <FadeIn>
          <h2 className="text-lg font-semibold theme-text">Security</h2>
        </FadeIn>
        <div className="mt-4">
          <Link to="/forgot-password" className="text-sm font-medium theme-primary-text hover:underline">Reset password</Link>
        </div>
      </section>

      <section className="rounded-xl border theme-border theme-surface p-4 theme-shadow">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="inline-flex items-center gap-2 rounded-lg border theme-border theme-surface px-4 py-2 text-sm font-medium theme-text hover:theme-surface-alt transition"
        >
          <LogOut className="h-4 w-4 theme-text-muted" />
          Logout
        </button>
      </section>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl theme-surface p-6 theme-shadow-lg">
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
                className="flex-1 rounded-lg theme-primary px-4 py-2 text-sm font-medium text-white hover:theme-primary-hover disabled:opacity-60 transition"
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

import { useState } from "react";
import { User, X, CheckCircle } from "lucide-react";
import { AVATARS, type AvatarId, getAvatarUrl } from "../assets/avatars/manifest";

interface AvatarPickerProps {
  currentAvatarId: AvatarId | string | null;
  onAvatarChange: (avatarId: string | null) => void;
  disabled?: boolean;
}

export default function AvatarPicker({ currentAvatarId, onAvatarChange, disabled = false }: AvatarPickerProps) {
  const [selectedId, setSelectedId] = useState<AvatarId | string | null>(currentAvatarId || null);
  const [open, setOpen] = useState(false);

  const isSelected = (id: string) => id === selectedId;

  const handleSelect = (id: AvatarId | string) => {
    setSelectedId(id);
  };

  const handleSave = () => {
    onAvatarChange(selectedId);
    setOpen(false);
  };

  const handleCancel = () => {
    setSelectedId(currentAvatarId || null);
    setOpen(false);
  };

  const avatarPreview = currentAvatarId ? getAvatarUrl(currentAvatarId) : null;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {avatarPreview ? (
          <img
            src={avatarPreview}
            alt="Profile avatar"
            className="h-20 w-20 rounded-full object-cover border-2 border-theme-border bg-theme-surface-alt cursor-pointer hover:scale-105 transition"
            onClick={() => setOpen(true)}
          />
        ) : (
          <div
            className="h-20 w-20 rounded-full bg-theme-accent-soft flex items-center justify-center cursor-pointer hover:scale-105 transition"
            onClick={() => setOpen(true)}
          >
            <User className="h-10 w-10 theme-primary-text" />
          </div>
        )}
      </div>
      {!disabled && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-xs theme-primary-text hover:theme-primary-hover underline underline-offset-2 font-medium"
        >
          Edit Avatar
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl theme-surface p-6 theme-shadow-lg border theme-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold theme-text">Choose Avatar</h3>
              <button
                type="button"
                onClick={handleCancel}
                className="text-xs theme-text-muted hover:theme-surface rounded-lg px-2 py-1 transition"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-9">
              {AVATARS.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => handleSelect(avatar.id)}
                  disabled={disabled}
                  className={`relative h-14 w-14 rounded-xl border-2 transition-all duration-200 flex items-center justify-center ${isSelected(avatar.id) ? "border-theme-primary bg-theme-primary-soft" : "border-theme-border bg-theme-surface-alt hover:border-theme-primary hover:bg-theme-primary-soft"}`}
                >
                  <img
                    src={getAvatarUrl(avatar.id)}
                    alt={avatar.name}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                  {isSelected(avatar.id) && (
                    <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-theme-primary flex items-center justify-center text-white shadow-sm">
                      <CheckCircle className="h-3 w-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 rounded-xl border theme-border theme-surface-alt px-4 py-2.5 text-sm font-medium theme-text hover:theme-surface disabled:opacity-60 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!selectedId}
                className="flex-1 rounded-xl theme-primary px-4 py-2.5 text-sm font-medium text-white hover:theme-primary-hover disabled:opacity-60 transition"
              >
                Save Avatar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

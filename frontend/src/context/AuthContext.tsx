import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AuthUser } from "../services/auth";
import { fetchMe, logoutUser } from "../services/auth";
import api from "../services/api";
import { supabase } from "../services/supabase";

interface UserProfile extends AuthUser {
  displayName?: string;
  avatarUrl?: string;
}

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  login: (token: string, u: AuthUser) => void;
  logout: () => Promise<void>;
  updateProfile: (updates: { displayName?: string; avatarUrl?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadUser = (u: AuthUser | null): UserProfile | null => {
    if (!u) return null;
    const meta = (u as any).user_metadata || {};
    return {
      ...u,
      displayName: meta.display_name || "",
      avatarUrl: meta.avatar_url || "",
    };
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      fetchMe()
        .then((u) => setUser(loadUser(u)))
        .catch(() => {
          localStorage.removeItem("access_token");
          delete api.defaults.headers.common.Authorization;
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token: string, u: AuthUser) => {
    localStorage.setItem("access_token", token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setUser(loadUser(u));
  };

  const updateProfile = async (updates: { displayName?: string; avatarUrl?: string }) => {
    if (!user) return;
    const metadata: any = {};
    if (updates.displayName !== undefined) metadata.display_name = updates.displayName;
    if (updates.avatarUrl !== undefined) metadata.avatar_url = updates.avatarUrl;
    const { data, error } = await supabase.auth.updateUser({ data: metadata });
    if (error) throw error;
    if (data.user) {
      setUser((prev) => {
        if (!prev) return prev;
        const meta = data.user.user_metadata || {};
        return {
          ...prev,
          displayName: meta.display_name || prev.displayName,
          avatarUrl: meta.avatar_url || prev.avatarUrl,
        };
      });
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
      // ignore
    }
    localStorage.removeItem("access_token");
    delete api.defaults.headers.common.Authorization;
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
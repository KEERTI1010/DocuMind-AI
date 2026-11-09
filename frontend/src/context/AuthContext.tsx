import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AuthUser } from "../services/auth";
import { fetchMe, logoutUser } from "../services/auth";
import api from "../services/api";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      fetchMe()
        .then((u) => setUser(u))
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
    setUser(u);
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

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

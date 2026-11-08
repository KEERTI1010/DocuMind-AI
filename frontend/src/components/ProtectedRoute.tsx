import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const devPreviewEnabled =
  import.meta.env.DEV && import.meta.env.VITE_DEV_PREVIEW === "true";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (devPreviewEnabled) return <>{children}</>;
  if (loading) return <div className="p-6 text-slate-600">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

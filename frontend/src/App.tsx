import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { User } from "lucide-react";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import Documents from "./pages/Documents";
import Assistant from "./pages/Assistant";
import ChatHistory from "./pages/ChatHistory";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmailVerificationSuccess from "./pages/EmailVerificationSuccess";
import EmailVerificationCallback from "./pages/EmailVerificationCallback";
import logoImg from "./assets/Logo.png";
import { getAvatarUrl } from "./assets/avatars/manifest";

function WorkspaceLayout() {
  const { user } = useAuth();
  const navItems = [
    { to: "/documents", label: "My Documents" },
    { to: "/assistant", label: "AI Assistant" },
    { to: "/chat", label: "Chat History" },
    { to: "/settings", label: "Settings" },
  ];

  return (
    <div className="flex min-h-screen theme-bg theme-text">
      <aside className="w-64 shrink-0 border-r theme-border theme-surface flex flex-col">
        <div className="flex h-16 items-center gap-2 px-6 font-semibold theme-text shrink-0">
          <img src={logoImg} alt="DocuMind AI logo" className="h-7 w-auto" />
          <span>DocuMind AI</span>
        </div>
        <nav className="space-y-1 px-3 py-4 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded-xl px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "theme-nav-selected shadow-sm"
                    : "theme-text hover:theme-accent-soft"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        {user && (
          <div className="px-4 pb-6 pt-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full overflow-hidden border border-theme-border bg-theme-surface-alt">
                {user.avatarUrl ? (
                  <img src={getAvatarUrl(user.avatarUrl)} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-theme-accent-soft">
                    <User className="h-5 w-5 theme-primary-text" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium theme-text truncate">
                  {user.displayName || "User"}
                </p>
                <p className="text-xs theme-text-muted truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </aside>
      <main className="flex-1 p-6">
        <Routes>
          <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
          <Route path="/assistant" element={<ProtectedRoute><Assistant /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><ChatHistory /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-success" element={<EmailVerificationSuccess />} />
            <Route path="/verify-email" element={<EmailVerificationCallback />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/*" element={<WorkspaceLayout />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
import { BrowserRouter, Routes, Route, NavLink, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Assistant from "./pages/Assistant";
import ChatHistory from "./pages/ChatHistory";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/documents", label: "My Documents" },
  { to: "/assistant", label: "AI Assistant" },
  { to: "/chat", label: "Chat History" },
  { to: "/settings", label: "Settings" },
];

function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-16 items-center gap-2 px-6 font-semibold text-slate-900 dark:text-slate-100">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">D</span>
        DocuMind AI
      </div>
      <nav className="space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2 text-sm font-medium ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                  : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

function Layout() {
  const location = useLocation();
  const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
  const isAuth = authRoutes.includes(location.pathname);

  if (isAuth) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
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
          <Layout />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
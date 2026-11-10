import { Link } from "react-router-dom";
import logoIcon from "../assets/logo-icon.svg";

export default function Footer() {
  return (
    <footer className="border-t border-theme-border bg-theme-surface">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <img src={logoIcon} alt="DocuMind AI logo" className="h-7 w-7" />
              <span className="font-semibold theme-text">DocuMind AI</span>
            </div>
            <p className="mt-3 text-sm theme-text-muted">AI-powered document understanding for students and professionals.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold theme-text">Product</h3>
            <ul className="mt-3 space-y-2 text-sm theme-text-muted">
              <li><a href="#features" className="hover:theme-primary-text">Features</a></li>
              <li><a href="#how" className="hover:theme-primary-text">How it works</a></li>
              <li><Link to="/documents" className="hover:theme-primary-text">My Documents</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold theme-text">Company</h3>
            <ul className="mt-3 space-y-2 text-sm theme-text-muted">
              <li><a href="#about" className="hover:theme-primary-text">About</a></li>
              <li><Link to="/settings" className="hover:theme-primary-text">Settings</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold theme-text">Account</h3>
            <ul className="mt-3 space-y-2 text-sm theme-text-muted">
              <li><Link to="/login" className="hover:theme-primary-text">Login</Link></li>
              <li><Link to="/register" className="hover:theme-primary-text">Get Started</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-theme-border pt-6 text-sm theme-text-muted">
          © {new Date().getFullYear()} DocuMind AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">D</span>
              <span className="font-semibold text-slate-900">DocuMind AI</span>
            </div>
            <p className="mt-3 text-sm text-slate-500">AI-powered document understanding for students and professionals.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Product</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><a href="#features" className="hover:text-indigo-600">Features</a></li>
              <li><a href="#how" className="hover:text-indigo-600">How it works</a></li>
              <li><Link to="/documents" className="hover:text-indigo-600">My Documents</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Company</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><a href="#about" className="hover:text-indigo-600">About</a></li>
              <li><Link to="/settings" className="hover:text-indigo-600">Settings</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Account</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link to="/login" className="hover:text-indigo-600">Login</Link></li>
              <li><Link to="/register" className="hover:text-indigo-600">Get Started</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-100 pt-6 text-sm text-slate-500">
          © {new Date().getFullYear()} DocuMind AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
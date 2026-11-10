import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Hero from "../pages/Hero";
import Features from "../pages/Features";
import HowItWorks from "../pages/HowItWorks";
import About from "../pages/About";
import CTA from "../pages/CTA";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <LandingNavbar />
      <Hero />
      <Features />
      <HowItWorks />
      <About />
      <CTA />
      <Footer />
    </div>
  );
}

function LandingNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">D</span>
          <span className="font-semibold text-slate-900">DocuMind AI</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-slate-600 transition hover:text-indigo-600">Features</a>
          <a href="#how" className="text-sm font-medium text-slate-600 transition hover:text-indigo-600">How it works</a>
          <a href="#about" className="text-sm font-medium text-slate-600 transition hover:text-indigo-600">About</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-indigo-600">Login</Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            Get Started <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
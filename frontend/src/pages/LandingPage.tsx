import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Hero from "../pages/Hero";
import Features from "../pages/Features";
import HowItWorks from "../pages/HowItWorks";
import About from "../pages/About";
import CTA from "../pages/CTA";
import Footer from "../components/Footer";
import logoImg from "../assets/Logo.png";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-theme-bg text-theme-text">
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
    <header className="sticky top-0 z-40 border-b border-theme-border bg-theme-surface/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoImg} alt="DocuMind AI logo" className="h-7 w-auto" />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium theme-text-muted transition hover:theme-primary-text">Features</a>
          <a href="#how" className="text-sm font-medium theme-text-muted transition hover:theme-primary-text">How it works</a>
          <a href="#about" className="text-sm font-medium theme-text-muted transition hover:theme-primary-text">About</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium theme-text-muted hover:theme-primary-text">Login</Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-1 rounded-xl theme-primary-gradient px-4 py-2 text-sm font-semibold text-white shadow-sm hover:theme-primary-hover hover:shadow-sm"
          >
            Get Started <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
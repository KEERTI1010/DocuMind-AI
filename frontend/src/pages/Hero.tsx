import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "../components/animations";
import heroImage from "../assets/hero.png";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-theme-accent-blue-soft blur-3xl" />
        <div className="absolute left-10 top-20 h-64 w-64 rounded-full bg-theme-accent-pink-soft blur-2xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <FadeIn>
            <span className="inline-flex items-center gap-2 rounded-full bg-theme-accent-soft px-4 py-1.5 text-sm font-medium theme-primary-text">
              <span className="h-1.5 w-1.5 rounded-full bg-theme-primary" />
              AI-powered document understanding
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight theme-text sm:text-5xl lg:text-6xl">
              Your knowledge, <span className="theme-primary-text">one question</span> away.
            </h1>
            <p className="mt-5 text-lg theme-text-muted sm:text-xl">
              Upload your PDFs, ask any question, and get clear answers with source references — powered by Gemini AI.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl theme-primary-gradient px-7 py-3 text-base font-semibold text-white shadow-lg shadow-theme-accent-soft transition hover:theme-primary-hover hover:shadow-theme-accent-soft"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-theme-border bg-theme-surface px-7 py-3 text-base font-semibold theme-text shadow-sm transition hover:border-theme-primary hover:theme-primary-text hover:theme-shadow"
              >
                Explore features
              </a>
            </div>
          </FadeIn>

          <div className="relative flex items-center justify-center">
            <img
              src={heroImage}
              alt="DocuMind AI hero illustration"
              className="max-w-full h-auto rounded-2xl border theme-border shadow-lg block mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

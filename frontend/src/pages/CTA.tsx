import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "../components/animations";

export default function CTA() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-4xl px-6">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl border theme-border bg-gradient-to-br from-theme-accent-blue-soft to-theme-accent-pink-soft p-10 text-center shadow-xl sm:p-16">
            <div className="pointer-events-none absolute -left-20 -top-20 h-40 w-40 rounded-full bg-theme-accent-blue-soft blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-theme-accent-pink-soft blur-2xl" />
            <h2 className="relative text-3xl font-bold tracking-tight theme-text sm:text-4xl">
              Ready to understand your documents faster?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl theme-text-muted">
              Create your free account today and turn every PDF into a searchable knowledge base.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl theme-primary-gradient px-8 py-3 text-base font-semibold text-white shadow-lg shadow-theme-accent-soft transition hover:theme-primary-hover hover:shadow-theme-accent-soft"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-theme-border bg-theme-surface px-8 py-3 text-base font-semibold theme-text shadow-sm transition hover:border-theme-primary hover:theme-primary-text hover:theme-shadow"
              >
                Explore features
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
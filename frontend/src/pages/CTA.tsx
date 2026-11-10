import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "../components/animations";

export default function CTA() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-4xl px-6">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-white p-10 text-center shadow-xl sm:p-16">
            <div className="pointer-events-none absolute -left-20 -top-20 h-40 w-40 rounded-full bg-purple-200/40 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-indigo-200/40 blur-2xl" />
            <h2 className="relative text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Ready to understand your documents faster?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-base text-slate-600">
              Create your free account today and turn every PDF into a searchable knowledge base.
            </p>
            <div className="relative mt-8">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
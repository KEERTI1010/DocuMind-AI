import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FadeIn, Floating, FloatSlow } from "../components/animations";

function PDFCard({ rotate, top, left, right }: { rotate: string; top: string; left?: string; right?: string }) {
  return (
    <div
      className={`absolute hidden rounded-xl bg-white p-4 shadow-xl sm:block ${top} ${left} ${right} ${rotate}`}
    >
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
        <div className="h-3 w-3 rounded-full bg-red-300" />
        <div className="h-3 w-3 rounded-full bg-amber-300" />
        <div className="h-3 w-3 rounded-full bg-green-300" />
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-2 w-3/4 rounded bg-indigo-100" />
        <div className="h-2 w-1/2 rounded bg-slate-100" />
        <div className="mt-2 h-2 w-full rounded bg-slate-100" />
        <div className="h-2 w-2/3 rounded bg-slate-100" />
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-purple-200/40 blur-3xl" />
        <div className="absolute left-10 top-20 h-64 w-64 rounded-full bg-indigo-100/50 blur-2xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <FadeIn>
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              AI-powered document understanding
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Your knowledge, <span className="text-indigo-600">one question</span> away.
            </h1>
            <p className="mt-5 text-lg text-slate-600 sm:text-xl">
              Upload your PDFs, ask any question, and get clear answers with source references — powered by Gemini AI.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700"
              >
                Explore features
              </a>
            </div>
          </FadeIn>

          <div className="relative h-[420px]">
            <Floating>
              <PDFCard rotate="-rotate-6" top="top-10" left="left-0" />
            </Floating>
            <FloatSlow>
              <PDFCard rotate="rotate-6" top="top-40" right="right-0" />
            </FloatSlow>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-xl">
                <span className="text-3xl font-bold text-white">D</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
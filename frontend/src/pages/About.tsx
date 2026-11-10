import { ScrollReveal } from "../components/animations";

export default function About() {
  return (
    <section id="about" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <ScrollReveal>
            <span className="text-sm font-semibold uppercase tracking-wide text-indigo-600">About</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Built for people who live in documents
            </h2>
            <p className="mt-4 text-base text-slate-600">
              DocuMind AI helps students, researchers and professionals extract meaning from their PDFs. Instead of reading page after page, ask a question and get the exact passages that answer it.
            </p>
            <p className="mt-3 text-base text-slate-600">
              Every answer is grounded in your own documents with visible source references, so you can trust what you read and move forward with confidence.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-3xl font-bold text-indigo-600">10 MB</div>
                  <p className="mt-1 text-sm text-slate-500">Max file size</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-indigo-600">Source</div>
                  <p className="mt-1 text-sm text-slate-500">Every answer cited</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-indigo-600">Private</div>
                  <p className="mt-1 text-sm text-slate-500">Your documents stay yours</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-indigo-600">24/7</div>
                  <p className="mt-1 text-sm text-slate-500">Ask anytime</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
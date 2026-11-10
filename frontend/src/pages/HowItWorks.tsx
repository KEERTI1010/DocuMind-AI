import { ScrollReveal } from "../components/animations";

const steps = [
  {
    step: "01",
    title: "Upload your document",
    description: "Drag and drop a PDF into DocuMind AI. We securely store it and extract every page of text.",
  },
  {
    step: "02",
    title: "Ask your question",
    description: "Type anything you want to know. Our retrieval finds the most relevant passages across your document.",
  },
  {
    step: "03",
    title: "Get intelligent answers",
    description: "Receive clear answers with source references so you can verify every claim against the original text.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wide text-indigo-600">How it works</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              From document to answer in three simple steps
            </h2>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <ScrollReveal key={s.step} delay={i * 0.1}>
              <div className="relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <span className="text-4xl font-bold text-indigo-200">{s.step}</span>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
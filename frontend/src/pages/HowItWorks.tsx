import { ScrollReveal } from "../components/animations";

const steps = [
  {
    step: "01",
    title: "Upload your document",
    description: "Drag and drop a PDF into DocuMind AI. We securely store it and extract every page of text.",
    color: "theme-accent-blue-text",
  },
  {
    step: "02",
    title: "Ask your question",
    description: "Type anything you want to know. Our retrieval finds the most relevant passages across your document.",
    color: "theme-accent-pink-text",
  },
  {
    step: "03",
    title: "Get intelligent answers",
    description: "Receive clear answers with source references so you can verify every claim against the original text.",
    color: "theme-accent-mint-text",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wide theme-primary-text">How it works</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight theme-text sm:text-4xl">
              From document to answer in three simple steps
            </h2>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => {
            const bgClass = s.color === "theme-accent-blue-text"
              ? "theme-accent-blue-soft"
              : s.color === "theme-accent-pink-text"
              ? "theme-accent-pink-soft"
              : "theme-accent-mint-soft";
            return (
              <ScrollReveal key={s.step} delay={i * 0.1}>
                <div className="relative rounded-2xl border theme-border theme-surface p-8 shadow-sm">
                  <span className={`text-4xl font-bold rounded-full p-1.5 ${s.color} ${bgClass} inline-block mb-3`}>{s.step}</span>
                  <h3 className="mt-2 text-xl font-semibold theme-text">{s.title}</h3>
                  <p className="mt-2 text-sm theme-text-muted">{s.description}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
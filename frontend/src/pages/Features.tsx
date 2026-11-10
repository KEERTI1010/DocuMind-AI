import { FileText, MessageSquare, Search, Sparkles, BookOpen } from "lucide-react";
import { ScrollReveal } from "../components/animations";

const features = [
  {
    icon: FileText,
    title: "Upload PDFs instantly",
    description: "Drag and drop documents up to 10 MB. We extract and index every page so you can search them in seconds.",
    color: "from-indigo-100 to-purple-100",
  },
  {
    icon: Sparkles,
    title: "Ask questions in plain English",
    description: "Type any question about your documents and let AI find the exact passages that answer it.",
    color: "from-purple-100 to-fuchsia-100",
  },
  {
    icon: Search,
    title: "Answers with source references",
    description: "Every answer cites the document name, page number and chunk so you can verify it instantly.",
    color: "from-fuchsia-100 to-pink-100",
  },
  {
    icon: MessageSquare,
    title: "Persistent conversations",
    description: "Keep chatting across sessions. DocuMind AI remembers context so follow-up questions stay natural.",
    color: "from-indigo-100 to-violet-100",
  },
  {
    icon: BookOpen,
    title: "Understand long documents",
    description: "From research papers to handbooks, our AI summarizes and explains the content you care about.",
    color: "from-violet-100 to-purple-100",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal>
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wide text-indigo-600">Features</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need to understand your documents
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Upload, ask, and get verified answers — all in one beautiful workspace.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 0.08}>
              <div className="group h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-xl hover:-translate-y-1">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-indigo-700`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{f.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
import { Upload, FileText, Sparkles } from "lucide-react";

const recentDocs = [
  { id: "1", name: "Q3 Financial Report.pdf", status: "Processed", size: "2.4 MB" },
  { id: "2", name: "Employee Handbook.pdf", status: "Processed", size: "1.1 MB" },
  { id: "3", name: "Research Notes.pdf", status: "Empty", size: "0.8 MB" },
];

const suggestions = [
  "Summarize the main findings.",
  "What are the key risks mentioned?",
  "List all action items.",
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Your knowledge, one question away.</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          DocuMind AI helps you upload documents and ask questions about their contents. Sample data shown below is for UI preview only.
        </p>
      </section>

      <section className="rounded-2xl border-2 border-dashed border-indigo-200 bg-white p-8 text-center">
        <Upload className="mx-auto h-10 w-10 text-indigo-500" />
        <p className="mt-3 font-medium text-slate-900">Drag and drop a PDF here</p>
        <p className="text-sm text-slate-500">or click to browse. Max 10 MB.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Recent Documents</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentDocs.map((doc) => (
            <div key={doc.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-indigo-500" />
                <div>
                  <p className="font-medium text-slate-900">{doc.name}</p>
                  <p className="text-xs text-slate-500">{doc.size} · {doc.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900">Quick Start</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button key={s} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:border-indigo-300 hover:text-indigo-700">
              <Sparkles className="mr-2 inline h-4 w-4" />
              {s}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

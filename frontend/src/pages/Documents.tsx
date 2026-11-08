import { FileText } from "lucide-react";
export default function Documents() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">My Documents</h1>
      <p className="mt-2 text-slate-600">Document list will be connected to the backend soon.</p>
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 text-slate-500">No documents connected yet.</div>
      <FileText className="mt-4 h-6 w-6 text-slate-300" />
    </div>
  );
}

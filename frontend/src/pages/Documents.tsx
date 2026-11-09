import { useEffect, useState } from "react";
import { FileText, RefreshCw, Download, Eye } from "lucide-react";
import { fetchDocuments, getDownloadUrl, type DocumentItem } from "../services/documents";

export default function Documents() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const docs = await fetchDocuments();
      setDocuments(docs);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to load documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openDocument = async (doc: DocumentItem) => {
    setActionId(doc.id);
    setError("");
    try {
      const url = await getDownloadUrl(doc.id);
      window.location.href = url;
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to open document.");
    } finally {
      setActionId("");
    }
  };

  const downloadDocument = async (doc: DocumentItem) => {
    setActionId(doc.id);
    setError("");
    try {
      const url = await getDownloadUrl(doc.id);
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to download document.");
    } finally {
      setActionId("");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">My Documents</h1>
        <button onClick={load} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {loading && <p className="mt-6 text-sm text-slate-500">Loading documents...</p>}
      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}
      {!loading && !error && documents.length === 0 && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 text-slate-500">No documents uploaded yet.</div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <div key={doc.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="font-medium text-slate-900">{doc.name}</p>
                <p className="text-xs text-slate-500">
                  {(doc.size_bytes / 1024 / 1024).toFixed(2)} MB · {doc.status}
                </p>
                <p className="text-xs text-slate-400">{new Date(doc.created_at).toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => openDocument(doc)}
                disabled={actionId === doc.id}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                <Eye className="h-3 w-3" />
                View
              </button>
              <button
                onClick={() => downloadDocument(doc)}
                disabled={actionId === doc.id}
                className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2 py-1 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                <Download className="h-3 w-3" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
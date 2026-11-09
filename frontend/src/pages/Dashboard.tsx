import { useEffect, useRef, useState } from "react";
import { Upload, FileText } from "lucide-react";
import { uploadDocument, fetchDocuments, type DocumentItem } from "../services/documents";

const MAX_SIZE = 10 * 1024 * 1024;

export default function Dashboard() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const loadDocuments = async () => {
    try {
      const docs = await fetchDocuments();
      setDocuments(docs);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleFile = async (file: File) => {
    setError("");
    setMessage("");
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("File too large. Maximum size is 10 MB.");
      return;
    }

    setLoading(true);
    setProgress(0);
    try {
      await uploadDocument(file, setProgress);
      setMessage("Upload successful.");
      await loadDocuments();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Upload failed.");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold tracking-tight theme-text">Your knowledge, one question away.</h1>
        <p className="mt-2 max-w-2xl theme-text-muted">
          DocuMind AI helps you upload documents and ask questions about their contents.
        </p>
      </section>

      <section
        className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${dragging ? "border-indigo-400 theme-primary-soft" : "border-indigo-200 dark:border-indigo-900 theme-surface"}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <Upload className="mx-auto h-10 w-10 text-indigo-500" />
        <p className="mt-3 font-medium theme-text">Drag and drop a PDF here</p>
        <p className="text-sm theme-text-muted">or click to browse. Max 10 MB.</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Select PDF
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
        {loading && (
          <div className="mt-4">
            <div className="h-2 w-full rounded-full theme-surface-alt">
              <div className="h-2 rounded-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-sm theme-text-muted">Uploading... {progress}%</p>
          </div>
        )}
        {message && <p className="mt-3 text-sm text-green-500">{message}</p>}
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      </section>

      <section>
        <h2 className="text-lg font-semibold theme-text">My Documents</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documents.length === 0 && <p className="text-sm theme-text-muted">No documents uploaded yet.</p>}
          {documents.map((doc) => (
            <div key={doc.id} className="rounded-xl border theme-border theme-surface p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-indigo-500" />
                <div>
                  <p className="font-medium theme-text">{doc.name}</p>
                  <p className="text-xs theme-text-muted">
                    {(doc.size_bytes / 1024 / 1024).toFixed(2)} MB · {doc.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
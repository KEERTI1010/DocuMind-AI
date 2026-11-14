import { useEffect, useRef, useState } from "react";
import { FileText, RefreshCw, Download, Eye, Upload } from "lucide-react";
import { gsap } from "gsap";
import { fetchDocuments, getDownloadUrl, uploadDocument, type DocumentItem } from "../services/documents";
import FadeIn from "../components/FadeIn";

export default function Documents() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleUpload = async (file: File) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10 MB.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError("");

    try {
      await uploadDocument(file, setUploadProgress);
      setUploadProgress(100);
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Upload failed.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    gsap.fromTo(
      ".doc-card",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" }
    );
  }, [documents]);

  const openDocument = async (doc: DocumentItem) => {
    setActionId(doc.id);
    setError("");
    try {
      const url = await getDownloadUrl(doc.id);
      window.open(url, "_blank");
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
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch document");
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err: any) {
      setError(err?.message || "Failed to download document.");
    } finally {
      setActionId("");
    }
  };

  return (
    <div>
      <FadeIn>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold theme-text">My Documents</h1>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
            <button
              onClick={triggerFilePicker}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-lg theme-primary px-3 py-2 text-sm font-medium text-white hover:theme-primary-hover disabled:opacity-60 transition"
            >
              <Upload className="h-4 w-4" />
              Upload PDF
            </button>
            <button onClick={load} className="inline-flex items-center gap-2 rounded-lg border theme-border theme-surface px-3 py-2 text-sm font-medium theme-text hover:theme-surface-alt transition">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </FadeIn>

      {uploading && (
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-theme-border overflow-hidden">
            <div
              className="h-full bg-theme-primary transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <span className="text-sm theme-text-muted w-12 text-right">{uploadProgress}%</span>
        </div>
      )}

      {loading && <p className="mt-6 text-sm theme-text-muted">Loading documents...</p>}
      {error && <p className="mt-6 text-sm text-red-500">{error}</p>}
      {!loading && !error && documents.length === 0 && (
        <div className="mt-6 rounded-xl border theme-border theme-surface p-6 theme-text-muted">No documents uploaded yet.</div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {documents.map((doc) => (
          <div key={doc.id} className="doc-card rounded-xl border theme-border theme-surface p-4 theme-shadow hover:theme-shadow-lg hover:-translate-y-1 transition">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 theme-primary-text" />
              <div>
                <p className="font-medium theme-text">{doc.name}</p>
                <p className="text-xs theme-text-muted">
                  {(doc.size_bytes / 1024 / 1024).toFixed(2)} MB · {doc.status}
                </p>
                <p className="text-xs theme-text-faint">{new Date(doc.created_at).toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => openDocument(doc)}
                disabled={actionId === doc.id}
                className="inline-flex items-center gap-1 rounded-lg border theme-border theme-surface px-2 py-1 text-xs font-medium theme-text hover:theme-surface-alt disabled:opacity-60 transition"
              >
                <Eye className="h-3 w-3" />
                View
              </button>
              <button
                onClick={() => downloadDocument(doc)}
                disabled={actionId === doc.id}
                className="inline-flex items-center gap-1 rounded-lg theme-primary px-2 py-1 text-xs font-medium text-white hover:theme-primary-hover disabled:opacity-60 transition"
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
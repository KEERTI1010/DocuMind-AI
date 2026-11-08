import api from "./api";

export interface DocumentItem {
  id: string;
  name: string;
  status: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
}

export async function uploadDocument(file: File, onProgress?: (percent: number) => void) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/api/documents/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event) => {
      if (event.total && onProgress) {
        onProgress(Math.round((event.loaded * 100) / event.total));
      }
    },
  });

  return response.data;
}

export async function fetchDocuments() {
  const response = await api.get("/api/documents");
  return response.data.documents as DocumentItem[];
}

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Send } from "lucide-react";
import { fetchDocuments, type DocumentItem } from "../services/documents";
import {
  fetchConversations,
  createConversation,
  fetchMessages,
  sendMessage,
  type Conversation,
  type Message,
} from "../services/conversations";

export default function Assistant() {
  const [searchParams] = useSearchParams();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocId, setSelectedDocId] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [docsLoading, setDocsLoading] = useState(true);

  useEffect(() => {
    const doc = searchParams.get("doc");
    const conv = searchParams.get("conv");
    if (doc) setSelectedDocId(doc);
    if (conv) setSelectedConvId(conv);
  }, [searchParams]);

  useEffect(() => {
    fetchDocuments()
      .then(setDocuments)
      .catch(() => setError("Failed to load documents."))
      .finally(() => setDocsLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedDocId) {
      setConversations([]);
      setSelectedConvId("");
      setMessages([]);
      return;
    }
    fetchConversations(selectedDocId)
      .then((data) => {
        setConversations(data);
        if (data.length) {
          setSelectedConvId(data[0].id);
        } else {
          setSelectedConvId("");
          setMessages([]);
        }
      })
      .catch(() => setError("Failed to load conversations."));
  }, [selectedDocId]);

  useEffect(() => {
    if (!selectedConvId) {
      setMessages([]);
      return;
    }
    fetchMessages(selectedConvId)
      .then(setMessages)
      .catch(() => setError("Failed to load messages."));
  }, [selectedConvId]);

  const handleSend = async () => {
    const q = question.trim();
    if (!q || !selectedDocId) return;

    setLoading(true);
    setError("");
    try {
      let convId = selectedConvId;
      if (!convId) {
        const conv = await createConversation(selectedDocId, q.slice(0, 40));
        convId = conv.id;
        setSelectedConvId(convId);
        setConversations((prev) => [conv, ...prev]);
      }
      const newMessages = await sendMessage(convId, q);
      setMessages(newMessages);
      setQuestion("");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to get answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col">
      <h1 className="text-2xl font-bold theme-text">AI Assistant</h1>
      <p className="mt-1 text-sm theme-text-muted">Ask questions about your uploaded documents.</p>

      <div className="mt-4 flex flex-1 gap-4 overflow-hidden">
        <aside className="w-64 shrink-0 rounded-xl border theme-border theme-surface p-4">
          <label className="block text-sm font-medium theme-text-muted">Document</label>
          {docsLoading ? (
            <p className="mt-2 text-sm theme-text-muted">Loading...</p>
          ) : (
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="mt-2 w-full rounded-lg border theme-border theme-surface-alt px-3 py-2 text-sm theme-text focus:border-indigo-500 focus:outline-none"
            >
              <option value="">Select a document</option>
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.name}
                </option>
              ))}
            </select>
          )}
          {conversations.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium uppercase theme-text-muted">Conversations</p>
              <div className="mt-2 space-y-1">
                {conversations.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedConvId(c.id)}
                    className={`block w-full rounded-lg px-2 py-1 text-left text-sm ${selectedConvId === c.id ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300" : "theme-text-muted hover:theme-surface-alt"}`}
                  >
                    {c.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        <section className="flex flex-1 flex-col rounded-xl border theme-border theme-surface">
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {!selectedDocId && <p className="text-sm theme-text-muted">Select a document to start chatting.</p>}
            {selectedDocId && messages.length === 0 && !loading && (
              <p className="text-sm theme-text-muted">No messages yet. Ask a question.</p>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${m.role === "user" ? "ml-auto bg-indigo-600 text-white" : "theme-surface-alt theme-text"}`}>
                <p className="whitespace-pre-wrap">{m.content}</p>
                {m.role === "assistant" && m.sources?.length > 0 && (
                  <div className="mt-2 border-t theme-border pt-2 text-xs theme-text-muted">
                    Sources:{" "}
                    {m.sources.map((s, i) => (
                      <span key={i} className="mr-2">
                        {s.documentName}
                        {s.pageNumber ? ` (p.${s.pageNumber})` : ""} [chunk {s.chunkIndex}]
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && <p className="text-sm theme-text-muted">Thinking...</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <div className="border-t theme-border p-4">
            <div className="flex gap-2">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask a question about this document..."
                className="flex-1 rounded-lg border theme-border theme-surface-alt px-3 py-2 text-sm theme-text focus:border-indigo-500 focus:outline-none"
                disabled={!selectedDocId || loading}
              />
              <button
                onClick={handleSend}
                disabled={!selectedDocId || loading || !question.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                Send
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { fetchDocuments, type DocumentItem } from "../services/documents";
import { fetchConversations, type Conversation } from "../services/conversations";

interface HistoryItem {
  conversation: Conversation;
  documentName: string;
}

export default function ChatHistory() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const docs = await fetchDocuments();
        const results: HistoryItem[] = [];
        await Promise.all(
          docs.map(async (doc: DocumentItem) => {
            const convs = await fetchConversations(doc.id);
            convs.forEach((c) => results.push({ conversation: c, documentName: doc.name }));
          })
        );
        results.sort((a, b) => (a.conversation.created_at < b.conversation.created_at ? 1 : -1));
        setItems(results);
      } catch {
        setError("Failed to load chat history.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p className="text-sm theme-text-muted">Loading conversations...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (items.length === 0) return <p className="text-sm theme-text-muted">No conversations yet.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold theme-text">Chat History</h1>
      <div className="mt-6 space-y-3">
        {items.map(({ conversation, documentName }) => (
          <button
            key={conversation.id}
            onClick={() => navigate(`/assistant?doc=${conversation.document_id}&conv=${conversation.id}`)}
            className="flex w-full items-center gap-3 rounded-xl border theme-border theme-surface p-4 text-left hover:border-indigo-300"
          >
            <MessageSquare className="h-5 w-5 text-indigo-500" />
            <div>
              <p className="font-medium theme-text">{conversation.title}</p>
              <p className="text-xs theme-text-muted">{documentName} · {new Date(conversation.created_at).toLocaleString()}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

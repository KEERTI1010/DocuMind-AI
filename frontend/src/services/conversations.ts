import api from "./api";

export interface Conversation {
  id: string;
  document_id: string;
  title: string;
  created_at: string;
}

export interface MessageSource {
  documentName: string;
  pageNumber: number | null;
  chunkIndex: number;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources: MessageSource[];
  created_at: string;
}

export async function fetchConversations(documentId: string) {
  const response = await api.get(`/api/documents/${documentId}/conversations`);
  return response.data.conversations as Conversation[];
}

export async function createConversation(documentId: string, title?: string) {
  const response = await api.post(`/api/documents/${documentId}/conversations`, { title });
  return response.data.conversation as Conversation;
}

export async function fetchMessages(conversationId: string) {
  const response = await api.get(`/api/conversations/${conversationId}/messages`);
  return response.data.messages as Message[];
}

export async function sendMessage(conversationId: string, question: string) {
  const response = await api.post(`/api/conversations/${conversationId}/messages`, { question });
  return response.data.messages as Message[];
}

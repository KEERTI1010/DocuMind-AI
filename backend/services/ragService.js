const { GoogleGenerativeAI } = require("@google/generative-ai");
const { supabaseAdmin } = require("../config/supabase");

const STOP_WORDS = new Set(["the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by", "is", "are", "was", "were", "be", "been", "this", "that", "it", "as", "from"]);

function tokenize(text) {
  return (text || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

function retrieveChunks(question, chunks, limit = 5) {
  const questionTerms = new Set(tokenize(question));
  const scored = chunks.map((chunk) => {
    const chunkTerms = tokenize(chunk.content);
    let score = 0;
    questionTerms.forEach((term) => {
      if (chunkTerms.includes(term)) score += 1;
    });
    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const relevant = scored.filter((item) => item.score > 0).slice(0, limit);
  const selected = relevant.length ? relevant : scored.slice(0, Math.min(limit, scored.length));
  return selected.map((item) => item.chunk);
}

async function generateAnswer(documentId, question) {
  const { data: document, error: docError } = await supabaseAdmin
    .from("documents")
    .select("id, name")
    .eq("id", documentId)
    .single();

  if (docError || !document) {
    throw new Error("DOCUMENT_NOT_FOUND");
  }

  const { data: chunks, error: chunkError } = await supabaseAdmin
    .from("document_chunks")
    .select("content, chunk_index, page_number")
    .eq("document_id", documentId)
    .order("chunk_index", { ascending: true });

  if (chunkError) {
    throw new Error("CHUNK_FETCH_FAILED");
  }

  if (!chunks || chunks.length === 0) {
    throw new Error("NO_TEXT");
  }

  const selected = retrieveChunks(question, chunks, 5);

  const context = selected
    .map((chunk, index) => `Chunk ${index + 1} (page ${chunk.page_number ?? "unknown"}, index ${chunk.chunk_index}):\n${chunk.content}`)
    .join("\n\n");

  console.log("RAG: generating answer", { documentId });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("AI_NOT_CONFIGURED");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

  const prompt = `You are a document question-answering assistant. Answer the user's question using only the provided document context. If the answer is not present in the context, say that the document does not contain enough information. Do not invent page numbers or citations.

Context:
${context}

Question: ${question}`;

  const geminiPromise = model.generateContent(prompt);
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("GEMINI_TIMEOUT")), 30000)
  );
  const result = await Promise.race([geminiPromise, timeoutPromise]);
  console.log("RAG: Gemini response received");
  const answer = result.response.text() || "The document does not contain enough information.";

  const sources = selected.map((chunk) => ({
    documentName: document.name,
    pageNumber: chunk.page_number ?? null,
    chunkIndex: chunk.chunk_index,
  }));

  return { answer, sources };
}

module.exports = { generateAnswer };

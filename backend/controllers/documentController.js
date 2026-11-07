const { PDFParse } = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { supabaseAdmin } = require("../config/supabase");
const { extractTextWithGemini } = require("../services/ocrService");

const PDF_SIGNATURE = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d]); // %PDF-

function chunkText(text, size = 1000, overlap = 200) {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + size, text.length);
    chunks.push(text.slice(start, end));
    if (end === text.length) break;
    start = end - overlap;
    if (start < 0) start = 0;
  }
  return chunks;
}

async function uploadDocument(req, res) {
  const user = req.user;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "PDF file is required" });
  }

  if (!file.buffer || file.buffer.length < 5 || !file.buffer.slice(0, 5).equals(PDF_SIGNATURE)) {
    return res.status(400).json({ error: "Invalid PDF file" });
  }

  const storagePath = `${user.id}/${Date.now()}-${file.originalname}`;

  try {
    const { error: storageError } = await supabaseAdmin.storage
      .from("documents")
      .upload(storagePath, file.buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (storageError) {
      return res.status(500).json({ error: "Failed to upload file to storage" });
    }

    let parser;
    let extractedText = "";
    let pages = [];
    try {
      parser = new PDFParse({ data: new Uint8Array(file.buffer) });
      const result = await parser.getText();
      extractedText = result.text || "";
      pages = result.pages || [];
      await parser.destroy();
    } catch (err) {
      await supabaseAdmin.storage.from("documents").remove([storagePath]);
      return res.status(422).json({ error: "Failed to extract text from PDF" });
    }

    if (!extractedText.trim()) {
      try {
        extractedText = await extractTextWithGemini(file.buffer);
      } catch (err) {
        await supabaseAdmin.storage.from("documents").remove([storagePath]);
        return res.status(422).json({ error: "Failed to extract text from PDF" });
      }
    }

    if (!extractedText.trim()) {
      await supabaseAdmin.storage.from("documents").remove([storagePath]);
      return res.status(422).json({ error: "No text could be extracted from PDF" });
    }

    const { data: doc, error: docError } = await supabaseAdmin
      .from("documents")
      .insert({
        user_id: user.id,
        name: file.originalname,
        storage_path: storagePath,
        mime_type: file.mimetype,
        size_bytes: file.size,
        status: extractedText.trim() ? "processed" : "empty",
      })
      .select("id")
      .single();

    if (docError) {
      await supabaseAdmin.storage.from("documents").remove([storagePath]);
      return res.status(500).json({ error: "Failed to save document metadata" });
    }

    const documentId = doc.id;

    const chunks = [];
    if (pages.length > 0) {
      pages.forEach((page, pageIndex) => {
        const pageChunks = chunkText(page.text || "");
        pageChunks.forEach((chunk, chunkIndex) => {
          chunks.push({
            document_id: documentId,
            chunk_index: chunks.length,
            page_number: pageIndex + 1,
            content: chunk,
          });
        });
      });
    } else {
      chunkText(extractedText).forEach((chunk, index) => {
        chunks.push({
          document_id: documentId,
          chunk_index: index,
          page_number: null,
          content: chunk,
        });
      });
    }

    if (chunks.length > 0) {
      const { error: chunkError } = await supabaseAdmin
        .from("document_chunks")
        .insert(chunks);

      if (chunkError) {
        console.error("document_chunks insert error:", chunkError.message, chunkError.code, chunkError.details);
        await supabaseAdmin.from("documents").delete().eq("id", documentId);
        await supabaseAdmin.storage.from("documents").remove([storagePath]);
        return res.status(500).json({ error: "Failed to save document chunks" });
      }
    }

    return res.status(201).json({
      message: "Document uploaded successfully",
      document: { id: documentId, name: file.originalname, status: extractedText.trim() ? "processed" : "empty" },
      chunkCount: chunks.length,
    });
  } catch (err) {
    await supabaseAdmin.storage.from("documents").remove([storagePath]).catch(() => {});
    return res.status(500).json({ error: "Upload failed" });
  }
}

async function listDocuments(req, res) {
  const user = req.user;

  try {
    const { data, error } = await supabaseAdmin
      .from("documents")
      .select("id, name, status, mime_type, size_bytes, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: "Failed to fetch documents" });
    }

    return res.json({ documents: data || [] });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch documents" });
  }
}

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

const { generateAnswer } = require("../services/ragService");

async function askDocument(req, res) {
  const user = req.user;
  const { documentId } = req.params;
  const question = (req.body?.question || "").trim();

  if (!question) {
    return res.status(400).json({ error: "Question is required" });
  }

  if (question.length > 2000) {
    return res.status(400).json({ error: "Question is too long" });
  }

  try {
    const { data: document, error: docError } = await supabaseAdmin
      .from("documents")
      .select("id")
      .eq("id", documentId)
      .eq("user_id", user.id)
      .single();

    if (docError || !document) {
      return res.status(404).json({ error: "Document not found" });
    }

    const { answer, sources } = await generateAnswer(documentId, question);
    return res.json({ answer, sources });
  } catch (err) {
    if (err.message === "DOCUMENT_NOT_FOUND") return res.status(404).json({ error: "Document not found" });
    if (err.message === "NO_TEXT") return res.status(404).json({ error: "No text available for this document" });
    if (err.message === "AI_NOT_CONFIGURED") return res.status(500).json({ error: "AI service not configured" });
    return res.status(500).json({ error: "Failed to answer question" });
  }
}

module.exports = { uploadDocument, listDocuments, askDocument };

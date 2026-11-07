const { supabaseAdmin } = require("../config/supabase");

async function verifyDocumentOwnership(documentId, userId) {
  const { data, error } = await supabaseAdmin
    .from("documents")
    .select("id")
    .eq("id", documentId)
    .eq("user_id", userId)
    .single();

  if (error || !data) return false;
  return true;
}

async function createConversation(req, res) {
  const user = req.user;
  const { documentId } = req.params;
  const title = (req.body?.title || "").trim();

  try {
    const owns = await verifyDocumentOwnership(documentId, user.id);
    if (!owns) {
      return res.status(404).json({ error: "Document not found" });
    }

    const finalTitle = title ? title.slice(0, 100) : "New conversation";

    const { data, error } = await supabaseAdmin
      .from("conversations")
      .insert({
        user_id: user.id,
        document_id: documentId,
        title: finalTitle,
      })
      .select("id, document_id, title, created_at")
      .single();

    if (error) {
      return res.status(500).json({ error: "Failed to create conversation" });
    }

    return res.status(201).json({ conversation: data });
  } catch (err) {
    return res.status(500).json({ error: "Failed to create conversation" });
  }
}

async function listConversations(req, res) {
  const user = req.user;
  const { documentId } = req.params;

  try {
    const owns = await verifyDocumentOwnership(documentId, user.id);
    if (!owns) {
      return res.status(404).json({ error: "Document not found" });
    }

    const { data, error } = await supabaseAdmin
      .from("conversations")
      .select("id, document_id, title, created_at")
      .eq("user_id", user.id)
      .eq("document_id", documentId)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: "Failed to fetch conversations" });
    }

    return res.json({ conversations: data || [] });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch conversations" });
  }
}

module.exports = { createConversation, listConversations };

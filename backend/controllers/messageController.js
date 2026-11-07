const { supabaseAdmin } = require("../config/supabase");
const { generateAnswer } = require("../services/ragService");

async function getConversation(conversationId, userId) {
  const { data, error } = await supabaseAdmin
    .from("conversations")
    .select("id, document_id, user_id")
    .eq("id", conversationId)
    .eq("user_id", userId)
    .single();
  if (error || !data) return null;
  return data;
}

async function postMessage(req, res) {
  const user = req.user;
  const { conversationId } = req.params;
  const question = (req.body?.question || "").trim();

  if (!question) {
    return res.status(400).json({ error: "Question is required" });
  }
  if (question.length > 2000) {
    return res.status(400).json({ error: "Question is too long" });
  }

  try {
    console.log("MSG: start", { conversationId });
    const conversation = await getConversation(conversationId, user.id);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    console.log("MSG: inserting user message");
    const { data: lastMessage } = await supabaseAdmin
      .from("messages")
      .select("id, role, content, sources, created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let userMessage;
    if (lastMessage && lastMessage.role === "user" && lastMessage.content === question) {
      userMessage = lastMessage;
    } else {
      const { data, error: userMsgError } = await supabaseAdmin
        .from("messages")
        .insert({
          conversation_id: conversationId,
          role: "user",
          content: question,
          sources: [],
        })
        .select("id, role, content, sources, created_at")
        .single();

      if (userMsgError) {
        return res.status(500).json({ error: "Failed to save message" });
      }
      userMessage = data;
    }

    let answer;
    let sources;
    console.log("MSG: generating answer");
    try {
      const result = await generateAnswer(conversation.document_id, question);
      answer = result.answer;
      sources = result.sources;
    } catch (err) {
      return res.status(500).json({ error: "Failed to generate answer" });
    }

    const { data: assistantMessage, error: assistantMsgError } = await supabaseAdmin
      .from("messages")
      .insert({
        conversation_id: conversationId,
        role: "assistant",
        content: answer,
        sources: sources || [],
      })
      .select("id, role, content, sources, created_at")
      .single();

    if (assistantMsgError) {
      return res.status(500).json({ error: "Failed to save assistant message" });
    }

    return res.status(201).json({ messages: [userMessage, assistantMessage] });
  } catch (err) {
    return res.status(500).json({ error: "Failed to process message" });
  }
}

async function getMessages(req, res) {
  const user = req.user;
  const { conversationId } = req.params;

  try {
    const conversation = await getConversation(conversationId, user.id);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const { data, error } = await supabaseAdmin
      .from("messages")
      .select("id, role, content, sources, created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      return res.status(500).json({ error: "Failed to fetch messages" });
    }

    return res.json({ messages: data || [] });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch messages" });
  }
}

module.exports = { postMessage, getMessages };

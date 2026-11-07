require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { supabaseAdmin } = require("./config/supabase");
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "DocuMind AI backend is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/documents", conversationRoutes);
app.use("/api/conversations", messageRoutes);

app.get("/api/health/supabase", async (req, res) => {
  try {
    const { error } = await supabaseAdmin
      .from("documents")
      .select("id")
      .limit(1);

    if (error) {
      return res.status(500).json({ status: "error", message: "Supabase connection failed" });
    }

    return res.json({ status: "ok", message: "Supabase connection successful" });
  } catch (err) {
    return res.status(500).json({ status: "error", message: "Supabase connection failed" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`DocuMind AI backend running on port ${PORT}`);
});

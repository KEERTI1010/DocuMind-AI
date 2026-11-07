const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const { createConversation, listConversations } = require("../controllers/conversationController");

router.post("/:documentId/conversations", authenticate, createConversation);
router.get("/:documentId/conversations", authenticate, listConversations);

module.exports = router;

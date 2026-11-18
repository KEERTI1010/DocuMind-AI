const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/authMiddleware");
const { aiLimiter } = require("../middleware/rateLimiter");
const { postMessage, getMessages } = require("../controllers/messageController");

router.post("/:conversationId/messages", authenticate, aiLimiter, postMessage);
router.get("/:conversationId/messages", authenticate, getMessages);

module.exports = router;

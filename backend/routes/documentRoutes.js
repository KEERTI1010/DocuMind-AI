const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { authenticate } = require("../middleware/authMiddleware");
const { uploadDocument, listDocuments, askDocument, getSignedUrl } = require("../controllers/documentController");

router.post("/upload", authenticate, upload.single("file"), (err, req, res, next) => {
  if (err) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ error: "File too large. Maximum size is 10 MB" });
    }
    return res.status(400).json({ error: err.message || "Invalid upload" });
  }
  next();
}, uploadDocument);

router.get("/", authenticate, listDocuments);
router.post("/:documentId/ask", authenticate, askDocument);
router.get("/:documentId/download", authenticate, getSignedUrl);

module.exports = router;

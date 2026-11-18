const express = require("express");
const router = express.Router();
const { register, login, me, logout, resendVerification } = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/rateLimiter");

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/resend-verification", authLimiter, resendVerification);
router.get("/me", authenticate, me);
router.post("/logout", authenticate, logout);

module.exports = router;

const rateLimit = require("express-rate-limit");

/**
 * Rate limiters for DocuMind AI backend.
 *
 * NOTE: Uses in-memory storage by default. This is suitable for a single
 * backend instance. For multiple backend instances (e.g., Render with
 * multiple replicas), use a shared store such as Redis via the `store`
 * option (e.g., @rate-limiter/redis or express-rate-limit with a custom
 * store). Otherwise each instance maintains its own counters and limits
 * are effectively multiplied by the number of instances.
 */

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  keyGenerator: (req) => req.ip,
  message: { error: "Too many authentication requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  keyGenerator: (req) => (req.user ? `user:${req.user.id}` : req.ip),
  message: { error: "Too many upload requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  keyGenerator: (req) => (req.user ? `user:${req.user.id}` : req.ip),
  message: { error: "Too many AI requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  keyGenerator: (req) => req.ip,
  message: { error: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, uploadLimiter, aiLimiter, generalLimiter };

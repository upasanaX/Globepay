require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const { initSchema } = require("./db/schema");

// Routes
const authRoutes         = require("./routes/auth");
const userRoutes         = require("./routes/users");
const walletRoutes       = require("./routes/wallets");
const transactionRoutes  = require("./routes/transactions");
const notificationRoutes = require("./routes/notifications");
const cardRoutes         = require("./routes/cards");
const exchangeRoutes     = require("./routes/exchange");
const savingsRoutes      = require("./routes/savings");

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Security middleware ──────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:3000",
    "http://localhost:5000",
    "http://localhost:3001",
  ],
  credentials: true,
}));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Rate limiting ────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: "Too many requests. Please try again later." },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many login attempts. Please wait 15 minutes." },
});
app.use("/api", limiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// ─── Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth",          authRoutes);
app.use("/api/users",         userRoutes);
app.use("/api/wallets",       walletRoutes);
app.use("/api/transactions",  transactionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/cards",         cardRoutes);
app.use("/api/exchange",      exchangeRoutes);
app.use("/api/savings",       savingsRoutes);

// ─── Health check ─────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", version: "1.0.0", timestamp: new Date().toISOString() });
});

// ─── 404 handler ─────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ─── Error handler ────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ─── Start ────────────────────────────────────────────────────────────────
initSchema().then(() => {
  app.listen(PORT, () => {
    console.log("");
    console.log("═══════════════════════════════════════════");
    console.log("  🌍 GlobePay API Server is running!");
    console.log("");
    console.log(`  API Base : http://localhost:${PORT}/api`);
    console.log(`  Health   : http://localhost:${PORT}/api/health`);
    console.log("═══════════════════════════════════════════");
    console.log("");
  });
}).catch(err => {
  console.error("Failed to initialize database schema:", err);
  process.exit(1);
});

module.exports = app;


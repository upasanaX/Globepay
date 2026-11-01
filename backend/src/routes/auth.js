const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { body, validationResult } = require("express-validator");
const db = require("../db/database");
const { generateAccessToken, generateRefreshToken, authenticate } = require("../middleware/auth");

const router = express.Router();
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "globepay_refresh_secret";

// ─── POST /api/auth/register ──────────────────────────────────────────────
router.post("/register",
  [
    body("name").trim().isLength({ min: 2 }),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 8 }).matches(/[A-Z]/).matches(/[0-9]/),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, phone, location } = req.body;
    const existing = await db("users").where({ email }).first();
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 12);
    const userId = uuidv4();
    const avatar = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

    await db("users").insert({ id: userId, name, email, password_hash: passwordHash, phone: phone || null, location: location || "Unknown", avatar });
    await db("wallets").insert({ id: uuidv4(), user_id: userId, currency: "USD", symbol: "$", flag: "🇺🇸", balance: 0, is_primary: true });
    await db("notifications").insert({ id: uuidv4(), user_id: userId, type: "system", title: "Welcome to GlobePay!", message: `Hi ${name}, your account is ready!`, icon: "🎉" });

    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);
    const refreshExp = new Date(); refreshExp.setDate(refreshExp.getDate() + 7);
    await db("refresh_tokens").insert({ id: uuidv4(), user_id: userId, token: refreshToken, expires_at: refreshExp.toISOString() });

    res.status(201).json({ message: "Account created", user: { id: userId, name, email, avatar }, accessToken, refreshToken });
  }
);

// ─── POST /api/auth/login ─────────────────────────────────────────────────
router.post("/login",
  [body("email").isEmail().normalizeEmail(), body("password").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const user = await db("users").where({ email }).first();
    if (!user) return res.status(401).json({ error: "Invalid email or password" });
    if (!user.is_active) return res.status(403).json({ error: "Account is deactivated" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: "Invalid email or password" });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    const refreshExp = new Date(); refreshExp.setDate(refreshExp.getDate() + 7);
    await db("refresh_tokens").insert({ id: uuidv4(), user_id: user.id, token: refreshToken, expires_at: refreshExp.toISOString() });

    res.json({
      user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, phone: user.phone, location: user.location, is_verified: !!user.is_verified, two_fa_enabled: !!user.two_fa_enabled },
      accessToken, refreshToken,
    });
  }
);

// ─── POST /api/auth/refresh ───────────────────────────────────────────────
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: "Refresh token required" });
  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    if (payload.type !== "refresh") return res.status(401).json({ error: "Invalid token type" });
    const stored = await db("refresh_tokens").where({ token: refreshToken }).first();
    if (!stored) return res.status(401).json({ error: "Token not found" });
    if (new Date(stored.expires_at) < new Date()) {
      await db("refresh_tokens").where({ token: refreshToken }).delete();
      return res.status(401).json({ error: "Refresh token expired" });
    }
    const newAccessToken = generateAccessToken(payload.sub);
    res.json({ accessToken: newAccessToken });
  } catch { res.status(401).json({ error: "Invalid refresh token" }); }
});

// ─── POST /api/auth/logout ────────────────────────────────────────────────
router.post("/logout", authenticate, async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) await db("refresh_tokens").where({ token: refreshToken }).delete();
  res.json({ message: "Logged out successfully" });
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────
router.get("/me", authenticate, async (req, res) => {
  const user = await db("users").where({ id: req.user.id })
    .select("id","name","email","phone","location","avatar","is_verified","two_fa_enabled","created_at").first();
  res.json({ user });
});

// ─── PUT /api/auth/change-password ───────────────────────────────────────
router.put("/change-password", authenticate,
  [body("currentPassword").notEmpty(), body("newPassword").isLength({ min: 8 }).matches(/[A-Z]/).matches(/[0-9]/)],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { currentPassword, newPassword } = req.body;
    const user = await db("users").where({ id: req.user.id }).select("password_hash").first();
    const match = await bcrypt.compare(currentPassword, user.password_hash);
    if (!match) return res.status(400).json({ error: "Current password is incorrect" });
    const newHash = await bcrypt.hash(newPassword, 12);
    await db("users").where({ id: req.user.id }).update({ password_hash: newHash });
    await db("refresh_tokens").where({ user_id: req.user.id }).delete();
    res.json({ message: "Password changed. Please log in again." });
  }
);

module.exports = router;

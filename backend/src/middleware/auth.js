const jwt = require("jsonwebtoken");
const db = require("../db/database");

const JWT_SECRET = process.env.JWT_SECRET || "globepay_secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "globepay_refresh_secret";

function generateAccessToken(userId) {
  return jwt.sign({ sub: userId, type: "access" }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "15m" });
}

function generateRefreshToken(userId) {
  return jwt.sign({ sub: userId, type: "refresh" }, JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" });
}

async function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access token required" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.type !== "access") return res.status(401).json({ error: "Invalid token type" });
    const user = await db("users").where({ id: payload.sub }).select("id","name","email","is_active").first();
    if (!user || !user.is_active) return res.status(401).json({ error: "User not found or deactivated" });
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") return res.status(401).json({ error: "Access token expired", code: "TOKEN_EXPIRED" });
    return res.status(401).json({ error: "Invalid access token" });
  }
}

module.exports = { generateAccessToken, generateRefreshToken, authenticate };

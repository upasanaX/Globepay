const express = require("express");
const { authenticate } = require("../middleware/auth");
const { getExchangeRate, getAllRates } = require("../services/exchangeRate");

const router = express.Router();

// ─── GET /api/exchange/rates ──────────────────────────────────────────────
// Public endpoint — no auth needed for basic rates display
router.get("/rates", async (req, res) => {
  const { base = "USD" } = req.query;
  const rates = await getAllRates(base.toUpperCase());
  res.json({ base, rates, timestamp: new Date().toISOString() });
});

// ─── GET /api/exchange/rate ───────────────────────────────────────────────
router.get("/rate", async (req, res) => {
  const { from = "USD", to = "EUR" } = req.query;
  const rate = await getExchangeRate(from.toUpperCase(), to.toUpperCase());
  res.json({ from, to, rate, timestamp: new Date().toISOString() });
});

// ─── POST /api/exchange/calculate ────────────────────────────────────────
router.post("/calculate", authenticate, async (req, res) => {
  const { from, to, amount } = req.body;
  if (!from || !to || !amount) {
    return res.status(400).json({ error: "from, to, and amount are required" });
  }
  const rate = await getExchangeRate(from.toUpperCase(), to.toUpperCase());
  const convertedAmount = parseFloat((amount * rate).toFixed(2));
  const fee = parseFloat((amount * 0.0035).toFixed(2));
  res.json({ from, to, amount, rate, convertedAmount, fee, total: parseFloat((amount + fee).toFixed(2)) });
});

module.exports = router;


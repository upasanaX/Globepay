const express = require("express");
const { body, validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const db = require("../db/database");
const { authenticate } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate);

const CURRENCY_META = {
  USD:{ symbol:"$",  flag:"🇺🇸" }, EUR:{ symbol:"€",  flag:"🇪🇺" }, GBP:{ symbol:"£",  flag:"🇬🇧" },
  JPY:{ symbol:"¥",  flag:"🇯🇵" }, INR:{ symbol:"₹",  flag:"🇮🇳" }, AUD:{ symbol:"A$", flag:"🇦🇺" },
  CAD:{ symbol:"C$", flag:"🇨🇦" }, CHF:{ symbol:"Fr", flag:"🇨🇭" }, SGD:{ symbol:"S$", flag:"🇸🇬" },
  AED:{ symbol:"د.إ",flag:"🇦🇪" },
};
const TO_USD = { USD:1,EUR:1.083,GBP:1.267,JPY:0.00669,INR:0.01203,AUD:0.65,CAD:0.73,CHF:1.11,SGD:0.74,AED:0.27 };

router.get("/", async (req, res) => {
  const wallets = await db("wallets").where({ user_id: req.user.id }).orderBy([{ column:"is_primary", order:"desc" }, { column:"currency" }]);
  res.json({ wallets });
});

router.get("/summary", async (req, res) => {
  const wallets = await db("wallets").where({ user_id: req.user.id });
  const totalUSD = wallets.reduce((acc, w) => acc + w.balance * (TO_USD[w.currency] || 1), 0);
  res.json({ wallets, totalUSD: Math.round(totalUSD * 100) / 100 });
});

router.post("/", [body("currency").isLength({ min:3, max:3 }).toUpperCase()], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { currency } = req.body;
  const meta = CURRENCY_META[currency];
  if (!meta) return res.status(400).json({ error: "Unsupported currency" });
  const existing = await db("wallets").where({ user_id: req.user.id, currency }).first();
  if (existing) return res.status(409).json({ error: "Wallet for this currency already exists" });
  const id = uuidv4();
  await db("wallets").insert({ id, user_id: req.user.id, currency, symbol: meta.symbol, flag: meta.flag, balance: 0, is_primary: false });
  const wallet = await db("wallets").where({ id }).first();
  res.status(201).json({ wallet });
});

router.get("/:currency", async (req, res) => {
  const wallet = await db("wallets").where({ user_id: req.user.id, currency: req.params.currency.toUpperCase() }).first();
  if (!wallet) return res.status(404).json({ error: "Wallet not found" });
  res.json({ wallet });
});

module.exports = router;

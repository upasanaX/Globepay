const express = require("express");
const { body, validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const db = require("../db/database");
const { authenticate } = require("../middleware/auth");
const { getExchangeRate } = require("../services/exchangeRate");

const router = express.Router();
router.use(authenticate);

router.get("/", async (req, res) => {
  const { page = 1, limit = 20, type, status, currency } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  let query = db("transactions").where({ user_id: req.user.id });
  if (type)     query = query.andWhere({ type });
  if (status)   query = query.andWhere({ status });
  if (currency) query = query.andWhere(function() { this.where({ from_currency: currency }).orWhere({ to_currency: currency }); });

  const [{ count }] = await query.clone().count("id as count");
  const transactions = await query.clone().orderBy("created_at", "desc").limit(parseInt(limit)).offset(offset);
  res.json({ transactions, pagination: { page: parseInt(page), limit: parseInt(limit), total: Number(count), pages: Math.ceil(Number(count) / parseInt(limit)) } });
});

router.get("/:id", async (req, res) => {
  const tx = await db("transactions").where({ id: req.params.id, user_id: req.user.id }).first();
  if (!tx) return res.status(404).json({ error: "Transaction not found" });
  res.json({ transaction: tx });
});

router.post("/send",
  [
    body("recipientEmail").isEmail().normalizeEmail(),
    body("amount").isFloat({ min: 0.01 }),
    body("fromCurrency").isLength({ min:3, max:3 }),
    body("toCurrency").isLength({ min:3, max:3 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { recipientEmail, recipientName, amount, fromCurrency, toCurrency } = req.body;
    const from = fromCurrency.toUpperCase();
    const to = toCurrency.toUpperCase();

    const wallet = await db("wallets").where({ user_id: req.user.id, currency: from }).first();
    if (!wallet) return res.status(400).json({ error: `You don't have a ${from} wallet` });

    const rate = await getExchangeRate(from, to);
    const fee = parseFloat((amount * 0.0035).toFixed(2));
    const convertedAmount = parseFloat((amount * rate).toFixed(2));
    const totalDeducted = parseFloat((parseFloat(amount) + fee).toFixed(2));

    if (wallet.balance < totalDeducted) return res.status(400).json({ error: "Insufficient balance (including fee)" });

    const txId = uuidv4();
    const ref = `GP-${Date.now().toString(36).toUpperCase()}`;

    try {
      await db.transaction(async (trx) => {
        await trx("wallets").where({ user_id: req.user.id, currency: from }).decrement("balance", totalDeducted);

        const recipient = await trx("users").where({ email: recipientEmail }).first();
        if (recipient) {
          const rWallet = await trx("wallets").where({ user_id: recipient.id, currency: to }).first();
          if (rWallet) {
            await trx("wallets").where({ user_id: recipient.id, currency: to }).increment("balance", convertedAmount);
            await trx("transactions").insert({ id: uuidv4(), user_id: recipient.id, type:"received", counterpart_name: req.user.name, counterpart_email: req.user.email, from_currency: from, to_currency: to, amount: convertedAmount, converted_amount: convertedAmount, exchange_rate: rate, fee: 0, status:"completed", reference: ref });
            await trx("notifications").insert({ id: uuidv4(), user_id: recipient.id, type:"transfer", title:"Money Received", message:`You received ${to === "JPY" || to === "INR" ? "" : "$"}${convertedAmount} ${to} from ${req.user.name}`, icon:"💰" });
          }
        }

        await trx("transactions").insert({ id: txId, user_id: req.user.id, type:"sent", counterpart_name: recipientName || recipientEmail, counterpart_email: recipientEmail, from_currency: from, to_currency: to, amount: parseFloat(amount), converted_amount: convertedAmount, exchange_rate: rate, fee, status:"completed", reference: ref });
      });

      const transaction = await db("transactions").where({ id: txId }).first();
      res.status(201).json({ message:"Transfer successful", transaction, summary: { sent: amount, received: convertedAmount, fee, rate, reference: ref } });
    } catch (err) {
      console.error("Transfer error:", err);
      res.status(500).json({ error: "Transfer failed. Please try again." });
    }
  }
);

router.post("/convert",
  [body("fromCurrency").isLength({ min:3, max:3 }), body("toCurrency").isLength({ min:3, max:3 }), body("amount").isFloat({ min:0.01 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { fromCurrency, toCurrency, amount } = req.body;
    const from = fromCurrency.toUpperCase();
    const to = toCurrency.toUpperCase();

    const fromWallet = await db("wallets").where({ user_id: req.user.id, currency: from }).first();
    if (!fromWallet || fromWallet.balance < amount) return res.status(400).json({ error: "Insufficient balance" });
    const toWallet = await db("wallets").where({ user_id: req.user.id, currency: to }).first();
    if (!toWallet) return res.status(400).json({ error: `You don't have a ${to} wallet. Please create one first.` });

    const rate = await getExchangeRate(from, to);
    const convertedAmount = parseFloat((amount * rate).toFixed(2));
    const fee = parseFloat((amount * 0.001).toFixed(2));
    const txId = uuidv4();

    try {
      await db.transaction(async (trx) => {
        await trx("wallets").where({ user_id: req.user.id, currency: from }).decrement("balance", parseFloat(amount) + fee);
        await trx("wallets").where({ user_id: req.user.id, currency: to }).increment("balance", convertedAmount);
        await trx("transactions").insert({ id: txId, user_id: req.user.id, type:"converted", from_currency: from, to_currency: to, amount: parseFloat(amount), converted_amount: convertedAmount, exchange_rate: rate, fee, status:"completed", description:`Converted ${from} → ${to}` });
      });
      const transaction = await db("transactions").where({ id: txId }).first();
      res.status(201).json({ message:"Conversion successful", transaction, rate, convertedAmount });
    } catch { res.status(500).json({ error: "Conversion failed" }); }
  }
);

module.exports = router;

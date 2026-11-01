const express = require("express");
const { body, validationResult } = require("express-validator");
const db = require("../db/database");
const { authenticate } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate);

// ─── GET /api/cards ───────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  const cards = await db("virtual_cards").where({ user_id: req.user.id }).orderBy("created_at", "asc");
  const masked = cards.map(c => ({
    ...c,
    number: `${c.type === "visa" ? "4" : "5"}••• •••• •••• ${c.number_last4}`,
    cvv: "•••",
    frozen: !!c.frozen,
  }));
  res.json({ cards: masked });
});

// ─── PUT /api/cards/:id/freeze ────────────────────────────────────────────
router.put("/:id/freeze", async (req, res) => {
  const card = await db("virtual_cards").where({ id: req.params.id, user_id: req.user.id }).first();
  if (!card) return res.status(404).json({ error: "Card not found" });

  const newFrozen = card.frozen ? false : true;
  await db("virtual_cards").where({ id: card.id }).update({ frozen: newFrozen });
  res.json({ message: newFrozen ? "Card frozen" : "Card unfrozen", frozen: newFrozen });
});

// ─── PUT /api/cards/:id/limit ─────────────────────────────────────────────
router.put(
  "/:id/limit",
  [body("dailyLimit").isFloat({ min: 0 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const card = await db("virtual_cards").where({ id: req.params.id, user_id: req.user.id }).first();
    if (!card) return res.status(404).json({ error: "Card not found" });

    await db("virtual_cards").where({ id: card.id }).update({ daily_limit: req.body.dailyLimit });
    res.json({ message: "Daily limit updated" });
  }
);

module.exports = router;

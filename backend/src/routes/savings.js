const express = require("express");
const { body, validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const db = require("../db/database");
const { authenticate } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate);

// ─── GET /api/savings ─────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  const goals = await db("savings_goals").where({ user_id: req.user.id }).orderBy("created_at", "desc");
  res.json({ goals });
});

// ─── POST /api/savings ────────────────────────────────────────────────────
router.post(
  "/",
  [
    body("name").trim().isLength({ min: 1 }),
    body("targetAmount").isFloat({ min: 1 }),
    body("currency").optional().isLength({ min: 3, max: 3 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, targetAmount, currency = "USD", deadline, icon = "🎯", color = "from-brand-500 to-purple-600" } = req.body;
    const id = uuidv4();
    await db("savings_goals").insert({
      id,
      user_id: req.user.id,
      name,
      target_amount: parseFloat(targetAmount),
      currency: currency.toUpperCase(),
      deadline: deadline || null,
      icon,
      color,
    });

    const goal = await db("savings_goals").where({ id }).first();
    res.status(201).json({ goal });
  }
);

// ─── PUT /api/savings/:id/deposit ─────────────────────────────────────────
router.put(
  "/:id/deposit",
  [body("amount").isFloat({ min: 0.01 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const goal = await db("savings_goals").where({ id: req.params.id, user_id: req.user.id }).first();
    if (!goal) return res.status(404).json({ error: "Savings goal not found" });

    const amount = parseFloat(req.body.amount);
    const wallet = await db("wallets").where({ user_id: req.user.id, currency: goal.currency }).first();
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ error: "Insufficient wallet balance" });
    }

    await db.transaction(async (trx) => {
      await trx("wallets").where({ user_id: req.user.id, currency: goal.currency }).decrement("balance", amount);
      await trx("savings_goals").where({ id: goal.id }).increment("current_amount", amount);
    });

    const updated = await db("savings_goals").where({ id: goal.id }).first();
    res.json({ goal: updated });
  }
);

// ─── DELETE /api/savings/:id ──────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  const goal = await db("savings_goals").where({ id: req.params.id, user_id: req.user.id }).first();
  if (!goal) return res.status(404).json({ error: "Goal not found" });
  await db("savings_goals").where({ id: goal.id }).delete();
  res.json({ message: "Goal deleted" });
});

module.exports = router;

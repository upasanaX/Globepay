const express = require("express");
const { body, validationResult } = require("express-validator");
const db = require("../db/database");
const { authenticate } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate);

router.get("/profile", async (req, res) => {
  const user = await db("users").where({ id: req.user.id }).select("id","name","email","phone","location","avatar","is_verified","two_fa_enabled","created_at").first();
  res.json({ user });
});

router.put("/profile",
  [body("name").optional().trim().isLength({ min:2 }), body("phone").optional().trim(), body("location").optional().trim()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { name, phone, location } = req.body;
    const updates = {};
    if (name)     updates.name = name;
    if (phone)    updates.phone = phone;
    if (location) updates.location = location;
    if (!Object.keys(updates).length) return res.status(400).json({ error: "No fields to update" });
    await db("users").where({ id: req.user.id }).update(updates);
    const user = await db("users").where({ id: req.user.id }).select("id","name","email","phone","location","avatar","is_verified","two_fa_enabled").first();
    res.json({ user });
  }
);

router.get("/stats", async (req, res) => {
  const [sentRow]     = await db("transactions").where({ user_id: req.user.id, type:"sent",     status:"completed" }).sum("amount as total");
  const [recvRow]     = await db("transactions").where({ user_id: req.user.id, type:"received", status:"completed" }).sum("amount as total");
  const [txRow]       = await db("transactions").where({ user_id: req.user.id }).count("id as count");
  const [rewardRow]   = await db("rewards").where({ user_id: req.user.id }).sum("points as total");
  res.json({ totalSent: sentRow.total || 0, totalReceived: recvRow.total || 0, txCount: txRow.count || 0, rewardPoints: rewardRow.total || 0 });
});

module.exports = router;

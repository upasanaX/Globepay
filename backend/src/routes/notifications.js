const express = require("express");
const db = require("../db/database");
const { authenticate } = require("../middleware/auth");

const router = express.Router();
router.use(authenticate);

// ─── GET /api/notifications ───────────────────────────────────────────────
router.get("/", async (req, res) => {
  const { unread_only } = req.query;
  let query = db("notifications").where({ user_id: req.user.id });
  if (unread_only === "true") query = query.andWhere({ is_read: false });

  const notifications = await query.orderBy("created_at", "desc").limit(50);
  const [{ count }] = await db("notifications")
    .where({ user_id: req.user.id, is_read: false })
    .count("id as count");

  res.json({ notifications, unreadCount: Number(count) });
});

// ─── PUT /api/notifications/:id/read ─────────────────────────────────────
router.put("/:id/read", async (req, res) => {
  await db("notifications").where({ id: req.params.id, user_id: req.user.id }).update({ is_read: true });
  res.json({ message: "Marked as read" });
});

// ─── PUT /api/notifications/read-all ─────────────────────────────────────
router.put("/read-all", async (req, res) => {
  await db("notifications").where({ user_id: req.user.id }).update({ is_read: true });
  res.json({ message: "All notifications marked as read" });
});

// ─── DELETE /api/notifications/:id ───────────────────────────────────────
router.delete("/:id", async (req, res) => {
  await db("notifications").where({ id: req.params.id, user_id: req.user.id }).delete();
  res.json({ message: "Notification deleted" });
});

module.exports = router;

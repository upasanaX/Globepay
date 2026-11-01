require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const db = require("./database");

async function initSchema() {
  // Users
  await db.schema.hasTable("users").then(async (exists) => {
    if (!exists) {
      await db.schema.createTable("users", (t) => {
        t.string("id").primary();
        t.string("name").notNullable();
        t.string("email").unique().notNullable();
        t.string("password_hash").notNullable();
        t.string("phone");
        t.string("location").defaultTo("Unknown");
        t.string("avatar");
        t.boolean("is_verified").defaultTo(false);
        t.boolean("is_active").defaultTo(true);
        t.boolean("two_fa_enabled").defaultTo(false);
        t.timestamp("created_at").defaultTo(db.fn.now());
        t.timestamp("updated_at").defaultTo(db.fn.now());
      });
    }
  });

  // Refresh tokens
  await db.schema.hasTable("refresh_tokens").then(async (exists) => {
    if (!exists) {
      await db.schema.createTable("refresh_tokens", (t) => {
        t.string("id").primary();
        t.string("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
        t.text("token").unique().notNullable();
        t.string("expires_at").notNullable();
        t.timestamp("created_at").defaultTo(db.fn.now());
      });
    }
  });

  // Wallets
  await db.schema.hasTable("wallets").then(async (exists) => {
    if (!exists) {
      await db.schema.createTable("wallets", (t) => {
        t.string("id").primary();
        t.string("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
        t.string("currency").notNullable();
        t.string("symbol").notNullable();
        t.string("flag").notNullable();
        t.float("balance").defaultTo(0);
        t.boolean("is_primary").defaultTo(false);
        t.timestamp("created_at").defaultTo(db.fn.now());
        t.unique(["user_id", "currency"]);
      });
    }
  });

  // Transactions
  await db.schema.hasTable("transactions").then(async (exists) => {
    if (!exists) {
      await db.schema.createTable("transactions", (t) => {
        t.string("id").primary();
        t.string("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
        t.enu("type", ["sent", "received", "converted", "bill", "reward"]).notNullable();
        t.string("counterpart_name");
        t.string("counterpart_email");
        t.string("from_currency").notNullable();
        t.string("to_currency");
        t.float("amount").notNullable();
        t.float("converted_amount");
        t.float("exchange_rate");
        t.float("fee").defaultTo(0);
        t.enu("status", ["completed", "pending", "failed"]).defaultTo("completed");
        t.text("description");
        t.string("reference");
        t.timestamp("created_at").defaultTo(db.fn.now());
      });
    }
  });

  // Virtual cards
  await db.schema.hasTable("virtual_cards").then(async (exists) => {
    if (!exists) {
      await db.schema.createTable("virtual_cards", (t) => {
        t.string("id").primary();
        t.string("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
        t.enu("type", ["visa", "mastercard"]).notNullable();
        t.string("card_name").notNullable();
        t.string("number_last4").notNullable();
        t.string("expiry").notNullable();
        t.string("currency").defaultTo("USD");
        t.float("balance").defaultTo(0);
        t.float("daily_limit").defaultTo(5000);
        t.float("spent_today").defaultTo(0);
        t.string("color").defaultTo("from-brand-600 via-purple-600 to-violet-600");
        t.boolean("frozen").defaultTo(false);
        t.timestamp("created_at").defaultTo(db.fn.now());
      });
    }
  });

  // Notifications
  await db.schema.hasTable("notifications").then(async (exists) => {
    if (!exists) {
      await db.schema.createTable("notifications", (t) => {
        t.string("id").primary();
        t.string("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
        t.string("type").notNullable();
        t.string("title").notNullable();
        t.text("message").notNullable();
        t.string("icon").defaultTo("🔔");
        t.boolean("is_read").defaultTo(false);
        t.timestamp("created_at").defaultTo(db.fn.now());
      });
    }
  });

  // Savings goals
  await db.schema.hasTable("savings_goals").then(async (exists) => {
    if (!exists) {
      await db.schema.createTable("savings_goals", (t) => {
        t.string("id").primary();
        t.string("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
        t.string("name").notNullable();
        t.float("target_amount").notNullable();
        t.float("current_amount").defaultTo(0);
        t.string("currency").defaultTo("USD");
        t.string("deadline");
        t.string("icon").defaultTo("🎯");
        t.string("color").defaultTo("from-brand-500 to-purple-600");
        t.timestamp("created_at").defaultTo(db.fn.now());
      });
    }
  });

  // Bill payments
  await db.schema.hasTable("bill_payments").then(async (exists) => {
    if (!exists) {
      await db.schema.createTable("bill_payments", (t) => {
        t.string("id").primary();
        t.string("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
        t.string("biller").notNullable();
        t.string("category").notNullable();
        t.float("amount").notNullable();
        t.string("currency").defaultTo("USD");
        t.string("due_date");
        t.string("paid_at");
        t.enu("status", ["pending", "paid", "failed"]).defaultTo("pending");
        t.timestamp("created_at").defaultTo(db.fn.now());
      });
    }
  });

  // Rewards
  await db.schema.hasTable("rewards").then(async (exists) => {
    if (!exists) {
      await db.schema.createTable("rewards", (t) => {
        t.string("id").primary();
        t.string("user_id").notNullable().references("id").inTable("users").onDelete("CASCADE");
        t.integer("points").defaultTo(0);
        t.string("action").notNullable();
        t.text("description");
        t.timestamp("created_at").defaultTo(db.fn.now());
      });
    }
  });

  console.log("✅ Schema initialized.");
}

module.exports = { initSchema };


const knex = require("knex");
const path = require("path");
const fs = require("fs");

const DB_PATH = process.env.DB_PATH || "./data/globepay.db";
const dir = path.dirname(path.resolve(DB_PATH));
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const db = knex({
  client: "sqlite3",
  connection: { filename: path.resolve(DB_PATH) },
  useNullAsDefault: true,
  pool: { min: 1, max: 1 },
});

module.exports = db;

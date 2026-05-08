const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./crm.db", (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_name TEXT,
      company_name TEXT,
      email TEXT,
      phone TEXT,
      lead_source TEXT,
      assigned_salesperson TEXT,
      status TEXT,
      estimated_value REAL,
      created_at TEXT,
      updated_at TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER,
      content TEXT,
      created_by TEXT,
      created_at TEXT,
      FOREIGN KEY (lead_id) REFERENCES leads(id)
    )
  `);
});

module.exports = db;
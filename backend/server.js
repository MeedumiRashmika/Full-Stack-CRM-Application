require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

/* =========================
   CREATE TEST USER
========================= */
const email = "admin@example.com";
const password = bcrypt.hashSync("password123", 8);

db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
  if (!user) {
    db.run(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, password]
    );
    console.log("Test user created");
  }
});

/* =========================
   LOGIN API
========================= */
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (!user) return res.status(404).json({ message: "User not found" });

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid)
      return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token });
  });
});

/* =========================
   AUTH MIDDLEWARE
========================= */
function verifyToken(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) return res.status(403).json({ message: "No token" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });

    req.userId = decoded.id;
    next();
  });
}

/* =========================
   CREATE LEAD
========================= */
app.post("/api/leads", verifyToken, (req, res) => {
  const {
    lead_name,
    company_name,
    email,
    phone,
    lead_source,
    assigned_salesperson,
    status,
    estimated_value,
  } = req.body;

  const now = new Date().toISOString();

  db.run(
    `INSERT INTO leads 
    (lead_name, company_name, email, phone, lead_source, assigned_salesperson, status, estimated_value, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      lead_name,
      company_name,
      email,
      phone,
      lead_source,
      assigned_salesperson,
      status,
      estimated_value,
      now,
      now,
    ],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    }
  );
});

/* =========================
   GET ALL LEADS
========================= */
app.get("/api/leads", verifyToken, (req, res) => {
  db.all("SELECT * FROM leads", [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

/* =========================
   DELETE LEAD
========================= */
app.delete("/api/leads/:id", verifyToken, (req, res) => {
  db.run("DELETE FROM leads WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Deleted" });
  });
});

/* =========================
   START SERVER
========================= */
/* =========================
   GET SINGLE LEAD
========================= */
app.get("/api/leads/:id", verifyToken, (req, res) => {
  db.get("SELECT * FROM leads WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json(err);
    res.json(row);
  });
});

/* =========================
   UPDATE LEAD
========================= */
app.put("/api/leads/:id", verifyToken, (req, res) => {
  const {
    lead_name,
    company_name,
    email,
    phone,
    lead_source,
    assigned_salesperson,
    status,
    estimated_value,
  } = req.body;

  const now = new Date().toISOString();

  db.run(
    `UPDATE leads SET
      lead_name = ?,
      company_name = ?,
      email = ?,
      phone = ?,
      lead_source = ?,
      assigned_salesperson = ?,
      status = ?,
      estimated_value = ?,
      updated_at = ?
     WHERE id = ?`,
    [
      lead_name,
      company_name,
      email,
      phone,
      lead_source,
      assigned_salesperson,
      status,
      estimated_value,
      now,
      req.params.id,
    ],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ message: "Lead updated" });
    }
  );
});

/* =========================
   GET NOTES
========================= */
app.get("/api/leads/:id/notes", verifyToken, (req, res) => {
  db.all(
    "SELECT * FROM notes WHERE lead_id = ? ORDER BY created_at DESC",
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows);
    }
  );
});

/* =========================
   ADD NOTE
========================= */
app.post("/api/leads/:id/notes", verifyToken, (req, res) => {
  const { content } = req.body;
  const now = new Date().toISOString();

  db.run(
    `INSERT INTO notes (lead_id, content, created_by, created_at)
     VALUES (?, ?, ?, ?)`,
    [req.params.id, content, "admin@example.com", now],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
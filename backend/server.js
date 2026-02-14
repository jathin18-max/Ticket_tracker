require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcrypt");
const { exec } = require("child_process");
const path = require("path");
const multer = require("multer");

const app = express();
const allowedOrigins = [
  "http://localhost:5173",                 // local frontend
  "https://ticket-tracker-rebl.onrender.com" // render frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests without origin (Postman, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ IMPORTANT: Preflight support
app.options(/.*/, cors());

/* =========================
   MIDDLEWARES
   ========================= */

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =========================
   FILE UPLOAD CONFIG
   ========================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/developer");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });
const upload2 = multer({ storage: storage2 });

app.post("/upload-dev-file", upload.single("file"), (req, res) => {
  res.json({
    message: "File stored successfully",
    fileName: req.file.filename,
    filePath: `uploads/developer/${req.file.filename}`
  });
});

app.post("/upload-dev-files", upload2.single("file"), (req, res) => {
  res.json({
    message: "File stored successfully",
    fileName: req.file.filename,
    filePath: `uploads/${req.file.filename}`
  });
});

/* =========================
   TICKET ROUTES
   ========================= */

app.get("/show", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM tickets");
    res.json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/completed", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM complete");
    res.json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/show-post", async (req, res) => {
  try {
    const { id, name, client, points, problem, solution } = req.body;

    const q =
      "INSERT INTO complete (id, name, client, points, problem, solution) VALUES (?, ?, ?, ?, ?, ?)";

    await db.query(q, [id, name, client, points, problem, solution]);
    res.json({ message: "Data inserted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Insert failed" });
  }
});

app.post("/admin-home", async (req, res) => {
  try {
    const { id, name, client, points, problem, priority } = req.body;

    const q =
      "INSERT INTO tickets (id, name, client, points, problem, priority) VALUES (?, ?, ?, ?, ?, ?)";

    await db.query(q, [id, name, client, points, problem, priority]);
    res.json({ message: "Data inserted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Insert failed" });
  }
});

app.delete("/show-post", async (req, res) => {
  try {
    const { id } = req.body;

    await db.query("DELETE FROM tickets WHERE id = ?", [id]);
    res.json({ message: "Ticket deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Delete failed" });
  }
});

/* =========================
   POINTS ROUTES
   ========================= */

app.put("/show-points", async (req, res) => {
  try {
    const { points } = req.body;

    await db.query("UPDATE points SET point = point + ?", [points]);
    res.json({ message: "Points updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Update failed" });
  }
});

app.get("/show-points", async (req, res) => {
  try {
    const [results] = await db.query("SELECT point FROM points");
    res.json(results.length > 0 ? results[0].point : 0);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Fetch failed" });
  }
});

/* =========================
   AUTH ROUTES
   ========================= */

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const [result] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (result.length > 0) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword]
    );

    res.json({ success: true, message: "Registration successful" });
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: "DB Error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const [result] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (result.length === 0) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, result[0].password);

    if (isMatch) {
      res.json({ success: true, message: "Login success" });
    } else {
      res.json({ success: false, message: "Wrong password" });
    }
  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: "DB Error" });
  }
});

/* =========================
   LOCAL VS CODE (DEV ONLY)
   ========================= */

app.get("/open-vscode", (req, res) => {
  exec("code", (error) => {
    if (error) return res.status(500).send("VS Code not found");
    res.send("VS Code opened");
  });
});

/* =========================
   SERVER START
   ========================= */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

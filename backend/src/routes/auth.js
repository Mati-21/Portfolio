const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { requireAuth } = require("../middleware/auth");
const prisma = require("../config/prisma");

const router = express.Router();

const isProduction = process.env.NODE_ENV === "production";

const COOKIE_OPTIONS = {
  httpOnly: true,          // Not accessible via JS
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax", // "none" required for cross-domain HTTPS
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ─────────────────────────────────────────────────
// POST /api/auth/login
// Body: { email, password }
// ─────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const trimmedEmail = email.trim();
    const admin = await prisma.admin.findFirst({
      where: {
        email: {
          equals: trimmedEmail,
          mode: "insensitive",
        },
      },
    });

    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, COOKIE_OPTIONS);

    return res.json({
      message: "Login successful",
      admin: { id: admin.id, email: admin.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ─────────────────────────────────────────────────
// POST /api/auth/logout
// ─────────────────────────────────────────────────
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
  return res.json({ message: "Logged out successfully" });
});

// ─────────────────────────────────────────────────
// GET /api/auth/me  — verify current session
// ─────────────────────────────────────────────────
router.get("/me", requireAuth, async (req, res) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.admin.id },
      select: { id: true, email: true, createdAt: true },
    });

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    return res.json({ admin });
  } catch (err) {
    console.error("Auth check error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

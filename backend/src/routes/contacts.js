const express = require("express");
const prisma = require("../config/prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// ─────────────────────────────────────────────────
// POST /api/contacts
// Submit a contact message from the portfolio (public)
// Body: { name, email, message }
// ─────────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required" });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    const contact = await prisma.contact.create({
      data: { name: name.trim(), email: email.trim().toLowerCase(), message: message.trim() },
    });

    return res.status(201).json({
      message: "Message received! We'll be in touch soon.",
      id: contact.id,
    });
  } catch (err) {
    console.error("Contact submit error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ─────────────────────────────────────────────────
// GET /api/contacts  (protected)
// Returns all contact messages, newest first
// Query: ?unread=true  to filter unread only
// ─────────────────────────────────────────────────
router.get("/", requireAuth, async (req, res) => {
  try {
    const { unread } = req.query;

    const where = unread === "true" ? { isRead: false } : {};

    const contacts = await prisma.contact.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const unreadCount = await prisma.contact.count({ where: { isRead: false } });

    return res.json({ contacts, unreadCount, total: contacts.length });
  } catch (err) {
    console.error("Get contacts error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ─────────────────────────────────────────────────
// PATCH /api/contacts/:id/read  (protected)
// Mark a contact message as read
// ─────────────────────────────────────────────────
router.patch("/:id/read", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await prisma.contact.update({
      where:  { id },
      data:   { isRead: true },
    });

    return res.json({ message: "Marked as read", contact });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Contact not found" });
    }
    console.error("Mark read error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ─────────────────────────────────────────────────
// DELETE /api/contacts/:id  (protected)
// Delete a contact message
// ─────────────────────────────────────────────────
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.contact.delete({ where: { id } });

    return res.json({ message: "Contact deleted" });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Contact not found" });
    }
    console.error("Delete contact error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
const prisma = new PrismaClient();

// ─────────────────────────────────────────────────
// GET /api/content
// Returns ALL content grouped by section (public)
// ─────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const rows = await prisma.content.findMany({
      orderBy: [{ section: "asc" }, { key: "asc" }],
    });

    // Group by section: { hero: { name: "...", title: "..." }, about: { ... } }
    const grouped = rows.reduce((acc, row) => {
      if (!acc[row.section]) acc[row.section] = {};
      acc[row.section][row.key] = row.value;
      return acc;
    }, {});

    return res.json({ content: grouped });
  } catch (err) {
    console.error("Get content error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ─────────────────────────────────────────────────
// GET /api/content/:section
// Returns content for a single section (public)
// ─────────────────────────────────────────────────
router.get("/:section", async (req, res) => {
  try {
    const { section } = req.params;
    const rows = await prisma.content.findMany({
      where: { section },
      orderBy: { key: "asc" },
    });

    const data = rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});

    return res.json({ section, data });
  } catch (err) {
    console.error("Get section error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ─────────────────────────────────────────────────
// PUT /api/content/:section  (protected)
// Body: { key: value, key2: value2, ... }
// Upserts each key-value pair for the section
// ─────────────────────────────────────────────────
router.put("/:section", requireAuth, async (req, res) => {
  try {
    const { section } = req.params;
    const updates = req.body;

    if (!updates || typeof updates !== "object") {
      return res.status(400).json({ error: "Request body must be a key-value object" });
    }

    const upsertOps = Object.entries(updates).map(([key, value]) =>
      prisma.content.upsert({
        where:  { section_key: { section, key } },
        update: { value: String(value) },
        create: { section, key, value: String(value) },
      })
    );

    await prisma.$transaction(upsertOps);

    // Return updated section
    const rows = await prisma.content.findMany({ where: { section } });
    const data = rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {});

    return res.json({ message: `Section "${section}" updated`, section, data });
  } catch (err) {
    console.error("Update content error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

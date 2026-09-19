require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const path = require("path");

const authRoutes      = require("./routes/auth");
const contentRoutes   = require("./routes/content");
const contactRoutes   = require("./routes/contacts");
const uploadRoutes    = require("./routes/upload");
const analyticsRoutes = require("./routes/analytics");

const app = express();
const PORT = process.env.PORT || 3001;

// ─────────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:5173",
    process.env.ADMIN_URL    || "http://localhost:5174",
  ],
  credentials: true, // Allow cookies to be sent cross-origin
}));

app.use(express.json());
app.use(express.text({ type: "text/plain" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ─────────────────────────────────────────────────
// Routes
// ─────────────────────────────────────────────────
app.use("/api/auth",      authRoutes);
app.use("/api/content",   contentRoutes);
app.use("/api/contacts",  contactRoutes);
app.use("/api/upload",    uploadRoutes);
app.use("/api/analytics", analyticsRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ─────────────────────────────────────────────────
// Start server
// ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Backend running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health\n`);
});

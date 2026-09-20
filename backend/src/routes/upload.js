const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const convert = require("heic-convert");
const { PrismaClient } = require("@prisma/client");
const { requireAuth } = require("../middleware/auth");
const {
  isCloudinaryConfigured,
  uploadFileToCloudinary,
  deleteFromCloudinary,
} = require("../config/cloudinary");

const prisma = require("../config/prisma");
const router = express.Router();

// Ensure uploads directory exists for temporary upload handling
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Check if a file is an HEIC/HEIF image
const isHeicFile = (file) => {
  const ext = path.extname(file.originalname || "").toLowerCase();
  const mime = (file.mimetype || "").toLowerCase();
  return (
    ext === ".heic" ||
    ext === ".heif" ||
    mime === "image/heic" ||
    mime === "image/heif" ||
    mime === "image/heic-sequence" ||
    mime === "image/heif-sequence"
  );
};

// Multer storage config
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `media-${uniqueSuffix}${ext}`);
  },
});

// File filter (images only, including HEIC/HEIF)
const fileFilter = (_req, file, cb) => {
  const allowedMimes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
    "image/heic",
    "image/heif",
    "image/heic-sequence",
    "image/heif-sequence",
    "application/octet-stream",
  ];
  const ext = path.extname(file.originalname || "").toLowerCase();
  const allowedExts = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".heic", ".heif"];

  if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext) || isHeicFile(file)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (JPEG, PNG, WebP, GIF, SVG, HEIC) are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 35 * 1024 * 1024 }, // 35MB limit for high-res mobile photos
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/upload/images — list all images stored in MediaImage catalog
// ─────────────────────────────────────────────────────────────────────────────
router.get("/images", async (req, res) => {
  try {
    const images = await prisma.mediaImage.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ success: true, count: images.length, images });
  } catch (err) {
    console.error("Failed to fetch media images:", err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/upload — upload single image (Cloudinary or local fallback)
// ─────────────────────────────────────────────────────────────────────────────
router.post("/", requireAuth, upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided" });
  }

  let currentFilePath = req.file.path;
  let finalFilename = req.file.filename;

  try {
    // If the uploaded file is HEIC/HEIF, convert it to standard JPEG so browsers can display it
    if (isHeicFile(req.file)) {
      const inputBuffer = await fs.promises.readFile(currentFilePath);
      const outputBuffer = await convert({
        buffer: inputBuffer,
        format: "JPEG",
        quality: 0.92,
      });

      const baseName = path.basename(req.file.filename, path.extname(req.file.filename));
      finalFilename = `${baseName}.jpg`;
      const newFilePath = path.join(uploadsDir, finalFilename);

      await fs.promises.writeFile(newFilePath, outputBuffer);

      // Clean up the original HEIC file
      try {
        await fs.promises.unlink(currentFilePath);
      } catch {
        // non-fatal
      }
      currentFilePath = newFilePath;
    }

    // Check if Cloudinary is configured
    if (isCloudinaryConfigured()) {
      // Upload to Cloudinary under folder 'portfolio'
      const cloudRes = await uploadFileToCloudinary(currentFilePath, {
        folder: "portfolio",
      });

      // Catalog in MediaImage table in the database
      const media = await prisma.mediaImage.create({
        data: {
          name: req.file.originalname || finalFilename,
          url: cloudRes.secure_url,
          publicId: cloudRes.public_id,
          format: cloudRes.format,
          bytes: cloudRes.bytes,
          width: cloudRes.width,
          height: cloudRes.height,
          section: req.body.section || "general",
        },
      });

      // Clean up temporary local file
      try {
        await fs.promises.unlink(currentFilePath);
      } catch {
        // non-fatal
      }

      return res.json({
        message: "Image uploaded to Cloudinary successfully",
        url: cloudRes.secure_url,
        publicId: cloudRes.public_id,
        mediaId: media.id,
        filename: finalFilename,
        size: cloudRes.bytes,
        provider: "cloudinary",
      });
    }

    // Fallback if Cloudinary credentials are not yet entered in .env
    const fileUrl = `/uploads/${finalFilename}`;
    const stats = await fs.promises.stat(currentFilePath).catch(() => ({ size: req.file.size }));
    return res.json({
      message: "Image uploaded locally (Configure Cloudinary in .env for cloud storage)",
      url: fileUrl,
      filename: finalFilename,
      size: stats.size,
      provider: "local",
    });
  } catch (err) {
    console.error("Image upload error:", err);
    // Cleanup on failure
    try {
      if (fs.existsSync(currentFilePath)) {
        await fs.promises.unlink(currentFilePath);
      }
    } catch {}
    return res.status(500).json({ error: "Failed to process image: " + err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/upload/images/:id — delete image from Cloudinary & database
// ─────────────────────────────────────────────────────────────────────────────
router.delete("/images/:id", requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const media = await prisma.mediaImage.findUnique({ where: { id } });

    if (!media) {
      return res.status(404).json({ error: "Image not found" });
    }

    if (media.publicId) {
      await deleteFromCloudinary(media.publicId).catch((e) => {
        console.warn("Cloudinary delete warning:", e.message);
      });
    }

    await prisma.mediaImage.delete({ where: { id } });

    res.json({ success: true, message: "Image removed successfully" });
  } catch (err) {
    console.error("Failed to delete media image:", err);
    res.status(500).json({ error: "Failed to delete image: " + err.message });
  }
});

// Error handling middleware for multer errors
router.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large (max 35MB)" });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
});

module.exports = router;

require("dotenv").config();
const path = require("path");
const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const {
  isCloudinaryConfigured,
  uploadFileToCloudinary,
} = require("../config/cloudinary");

const prisma = new PrismaClient();
const uploadsDir = path.join(__dirname, "../../uploads");

async function migrate() {
  console.log("==================================================");
  console.log("🚀 Starting Cloudinary Media Migration");
  console.log("==================================================\n");

  if (!isCloudinaryConfigured()) {
    console.error("❌ Cloudinary credentials are missing in backend/.env!");
    console.error("Please add the following to backend/.env:");
    console.error("  CLOUDINARY_CLOUD_NAME=\"your_cloud_name\"");
    console.error("  CLOUDINARY_API_KEY=\"your_api_key\"");
    console.error("  CLOUDINARY_API_SECRET=\"your_api_secret\"");
    process.exit(1);
  }

  console.log("✅ Cloudinary credentials verified.\n");

  // Step 1: Scan backend/uploads
  if (!fs.existsSync(uploadsDir)) {
    console.log("⚠️ Uploads directory does not exist. Nothing to upload.");
    return;
  }

  const localFiles = fs.readdirSync(uploadsDir).filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"].includes(ext);
  });

  console.log(`Found ${localFiles.length} local images in backend/uploads/`);

  // Map from "/uploads/<filename>" to Cloudinary secure_url
  const urlMap = new Map();

  for (let i = 0; i < localFiles.length; i++) {
    const filename = localFiles[i];
    const filePath = path.join(uploadsDir, filename);
    const localUrlPath = `/uploads/${filename}`;

    console.log(`\n[${i + 1}/${localFiles.length}] Uploading: ${filename}`);

    try {
      // Check if this image was already cataloged in MediaImage
      const existing = await prisma.mediaImage.findFirst({
        where: { name: filename },
      });

      if (existing) {
        console.log(`   ⏭️ Already uploaded: ${existing.url}`);
        urlMap.set(localUrlPath, existing.url);
        continue;
      }

      // Upload to Cloudinary under 'portfolio' folder
      const result = await uploadFileToCloudinary(filePath, {
        folder: "portfolio",
        use_filename: true,
        unique_filename: true,
      });

      console.log(`   ☁️ Cloudinary URL: ${result.secure_url}`);

      // Save in MediaImage catalog
      const media = await prisma.mediaImage.create({
        data: {
          name: filename,
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          bytes: result.bytes,
          width: result.width,
          height: result.height,
          section: filename.startsWith("avatar") ? "portfolio" : "projects",
        },
      });

      urlMap.set(localUrlPath, result.secure_url);
    } catch (err) {
      console.error(`   ❌ Failed to upload ${filename}:`, err.message);
    }
  }

  console.log(`\n✨ Successfully uploaded/mapped ${urlMap.size} images to Cloudinary!`);

  // Step 2: Update all image references in the database (Content table)
  console.log("\n==================================================");
  console.log("🔄 Updating Content Table References with Cloudinary URLs");
  console.log("==================================================\n");

  const allContent = await prisma.content.findMany();
  let updatedCount = 0;

  for (const item of allContent) {
    let modified = false;
    let newValue = item.value;

    // Check direct matching (e.g. /uploads/avatar-....jpg)
    if (urlMap.has(newValue.trim())) {
      newValue = urlMap.get(newValue.trim());
      modified = true;
    } else {
      // Check if value is a JSON string containing /uploads/...
      if (newValue.startsWith("[") || newValue.startsWith("{")) {
        try {
          const parsed = JSON.parse(newValue);
          let jsonModified = false;

          const replaceInObject = (obj) => {
            for (const key of Object.keys(obj)) {
              if (typeof obj[key] === "string") {
                for (const [localPath, cloudUrl] of urlMap.entries()) {
                  if (obj[key].includes(localPath)) {
                    obj[key] = obj[key].replace(localPath, cloudUrl);
                    jsonModified = true;
                  }
                }
              } else if (typeof obj[key] === "object" && obj[key] !== null) {
                replaceInObject(obj[key]);
              }
            }
          };

          replaceInObject(parsed);

          if (jsonModified) {
            newValue = JSON.stringify(parsed);
            modified = true;
          }
        } catch {
          // Not valid JSON, skip
        }
      }

      // Check substring replacement for any remaining /uploads/ references
      if (!modified && newValue.includes("/uploads/")) {
        for (const [localPath, cloudUrl] of urlMap.entries()) {
          if (newValue.includes(localPath)) {
            newValue = newValue.split(localPath).join(cloudUrl);
            modified = true;
          }
        }
      }
    }

    if (modified) {
      await prisma.content.update({
        where: { id: item.id },
        data: { value: newValue },
      });
      console.log(`✅ Updated [${item.section}] ${item.key}`);
      updatedCount++;
    }
  }

  console.log(`\n🎉 Migration complete! ${updatedCount} content entries updated with Cloudinary URLs.`);
}

migrate()
  .catch((err) => {
    console.error("Migration error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

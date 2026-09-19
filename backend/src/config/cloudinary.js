const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

const isCloudinaryConfigured = () => {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

/**
 * Upload a local file path to Cloudinary under the 'portfolio' folder
 */
const uploadFileToCloudinary = async (filePath, options = {}) => {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary credentials are not configured in .env");
  }

  return cloudinary.uploader.upload(filePath, {
    folder: "portfolio",
    resource_type: "auto",
    ...options,
  });
};

/**
 * Upload a memory buffer to Cloudinary under the 'portfolio' folder
 */
const uploadBufferToCloudinary = (buffer, options = {}) => {
  if (!isCloudinaryConfigured()) {
    return Promise.reject(new Error("Cloudinary credentials are not configured in .env"));
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "portfolio",
        resource_type: "auto",
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

/**
 * Delete a media file from Cloudinary by publicId
 */
const deleteFromCloudinary = async (publicId) => {
  if (!isCloudinaryConfigured()) return null;
  return cloudinary.uploader.destroy(publicId);
};

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  uploadFileToCloudinary,
  uploadBufferToCloudinary,
  deleteFromCloudinary,
};

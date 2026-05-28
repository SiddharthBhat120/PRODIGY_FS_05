// ====================================
// Upload Config — using Multer (local/memory)
// No Cloudinary needed — images stored as base64 or URL string
// ====================================

const multer = require("multer");

// Store file in memory as a Buffer
const storage = multer.memoryStorage();

// Only allow image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
});

module.exports = { upload };

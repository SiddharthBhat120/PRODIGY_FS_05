// ====================================
// PRODIGY_FS_05 - Social Media Backend
// Main server entry point
// ====================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// ---- Middleware ----
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));        // Allow large base64 images
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ---- Routes ----
const authRoutes  = require("./routes/auth");
const postRoutes  = require("./routes/posts");
const userRoutes  = require("./routes/users");

app.use("/api/auth",  authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

// ---- Default Route ----
app.get("/", (req, res) => {
  res.json({ message: "PRODIGY_FS_05 Social Media API is running!" });
});

// ---- Connect to MongoDB and Start Server ----
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)   // uses MONGO_URI
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

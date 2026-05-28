// ====================================
// User Routes
// GET /api/users/profile       - Get own profile
// PUT /api/users/profile       - Update profile
// GET /api/users/:id           - Get any user profile
// GET /api/users/:id/posts     - Get posts by user
// ====================================

const express = require("express");
const router  = express.Router();
const User    = require("../models/User");
const Post    = require("../models/Post");
const { protect } = require("../middleware/auth");
const { upload }  = require("../config/cloudinary");

// ---- GET OWN PROFILE ----
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---- UPDATE PROFILE ----
router.put("/profile", protect, upload.single("profileImage"), async (req, res) => {
  try {
    const { name, bio } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;

    // Convert profile image to base64 if uploaded
    if (req.file) {
      const base64 = req.file.buffer.toString("base64");
      updateData.profileImage = `data:${req.file.mimetype};base64,${base64}`;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---- GET ANY USER PROFILE ----
router.get("/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---- GET POSTS BY USER ----
router.get("/:id/posts", protect, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.id })
      .sort({ createdAt: -1 })
      .populate("user", "name profileImage");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

// ====================================
// Post Routes
// GET    /api/posts           - Get all posts
// POST   /api/posts           - Create new post (image as base64)
// PUT    /api/posts/like/:id  - Like/Unlike a post
// POST   /api/posts/comment/:id - Comment on a post
// DELETE /api/posts/:id       - Delete a post
// ====================================

const express = require("express");
const router  = express.Router();
const Post    = require("../models/Post");
const { protect } = require("../middleware/auth");
const { upload }  = require("../config/cloudinary"); // multer (no cloudinary)

// ---- GET ALL POSTS ----
router.get("/", protect, async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "name profileImage");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---- CREATE POST ----
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const { caption } = req.body;

    if (!caption && !req.file)
      return res.status(400).json({ message: "Caption or image is required" });

    // Convert uploaded file buffer → base64 data URL
    let imageData = "";
    if (req.file) {
      const base64 = req.file.buffer.toString("base64");
      imageData = `data:${req.file.mimetype};base64,${base64}`;
    }

    const post = await Post.create({
      user: req.user.id,
      caption: caption || "",
      image: imageData,
    });

    await post.populate("user", "name profileImage");
    res.status(201).json(post);
  } catch (err) {
    console.error("Create post error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ---- LIKE / UNLIKE POST ----
router.put("/like/:id", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = post.likes.includes(req.user.id);
    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json({ likes: post.likes, liked: !alreadyLiked });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---- COMMENT ON POST ----
router.post("/comment/:id", protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.unshift({
      user: req.user.id,
      name: req.body.userName,
      profileImage: req.body.userImage || "",
      text,
    });

    await post.save();
    res.json(post.comments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---- DELETE POST ----
router.delete("/:id", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

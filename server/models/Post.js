// ====================================
// Post Model
// Defines the structure of a post in MongoDB
// ====================================

const mongoose = require("mongoose");

// Schema for comments inside a post
const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Main Post schema
const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Who created this post
      required: true,
    },
    caption: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      default: "", // Cloudinary image URL
    },
    // Array of user IDs who liked this post
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Array of comments
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);

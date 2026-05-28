// ====================================
// PostCard Component
// Displays a single post with like and comment features
// ====================================

import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";

const PostCard = ({ post, onDelete, onUpdate }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);

  // Check if current user already liked this post
  const isLiked = post.likes.includes(user._id);

  // ---- Handle Like ----
  const handleLike = async () => {
    try {
      const res = await API.put(`/posts/like/${post._id}`);
      // Update the post in parent component
      onUpdate(post._id, { likes: res.data.likes });
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  // ---- Handle Comment ----
  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setLoading(true);
    try {
      const res = await API.post(`/posts/comment/${post._id}`, {
        text: commentText,
        userName: user.name,
        userImage: user.profileImage,
      });
      onUpdate(post._id, { comments: res.data });
      setCommentText(""); // Clear input
    } catch (err) {
      console.error("Comment error:", err);
    }
    setLoading(false);
  };

  // ---- Handle Delete ----
  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await API.delete(`/posts/${post._id}`);
      onDelete(post._id);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Format date nicely
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      
      {/* ---- Post Header ---- */}
      <div className="p-4 flex items-center justify-between">
        <Link to={`/profile/${post.user._id}`} className="flex items-center gap-3">
          {post.user.profileImage ? (
            <img
              src={post.user.profileImage}
              alt={post.user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {post.user.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-800">{post.user.name}</p>
            <p className="text-xs text-gray-400">{timeAgo(post.createdAt)}</p>
          </div>
        </Link>

        {/* Delete button — only for post owner */}
        {post.user._id === user._id && (
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500 text-sm"
          >
            🗑️
          </button>
        )}
      </div>

      {/* ---- Post Caption ---- */}
      {post.caption && (
        <div className="px-4 pb-3">
          <p className="text-gray-800">{post.caption}</p>
        </div>
      )}

      {/* ---- Post Image ---- */}
      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-full object-cover max-h-96"
        />
      )}

      {/* ---- Like and Comment Buttons ---- */}
      <div className="px-4 py-3 border-t border-gray-50">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 font-medium ${
              isLiked ? "text-red-500" : "text-gray-400 hover:text-red-400"
            }`}
          >
            {isLiked ? "❤️" : "🤍"} {post.likes.length}
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1 text-gray-400 hover:text-blue-500 font-medium"
          >
            💬 {post.comments.length}
          </button>
        </div>
      </div>

      {/* ---- Comments Section ---- */}
      {showComments && (
        <div className="px-4 pb-4 border-t border-gray-50">
          
          {/* Existing comments */}
          <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
            {post.comments.length === 0 && (
              <p className="text-gray-400 text-sm">No comments yet. Be first!</p>
            )}
            {post.comments.map((comment, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="font-semibold text-gray-700">{comment.name}</span>
                <span className="text-gray-600">{comment.text}</span>
              </div>
            ))}
          </div>

          {/* Add comment input */}
          <form onSubmit={handleComment} className="flex gap-2 mt-3">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "..." : "Post"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostCard;

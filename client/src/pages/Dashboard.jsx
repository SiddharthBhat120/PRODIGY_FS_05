// ====================================
// Dashboard Page
// Shows the feed of all posts
// ====================================

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import Spinner from "../components/Spinner";
import API from "../utils/api";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all posts when component loads
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");
      setPosts(res.data);
    } catch (err) {
      setError("Failed to load posts. Is the server running?");
    }
    setLoading(false);
  };

  // Called from PostCard when a post is deleted
  const handleDelete = (postId) => {
    setPosts(posts.filter((p) => p._id !== postId));
  };

  // Called from PostCard when likes/comments update
  const handleUpdate = (postId, updatedFields) => {
    setPosts(posts.map((p) =>
      p._id === postId ? { ...p, ...updatedFields } : p
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-6">
        
        {/* Quick post prompt */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            ✏️
          </div>
          <Link
            to="/create-post"
            className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-gray-400 hover:bg-blue-50 hover:text-blue-500 text-sm"
          >
            What's on your mind?
          </Link>
          <Link
            to="/create-post"
            className="text-blue-600 font-medium text-sm hover:underline"
          >
            Post
          </Link>
        </div>

        {/* Loading state */}
        {loading && <Spinner />}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-center">
            ⚠️ {error}
            <br />
            <button onClick={fetchPosts} className="mt-2 text-sm underline">
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-xl font-semibold text-gray-600">No posts yet</h2>
            <p className="text-gray-400 mt-2">Be the first to post something!</p>
            <Link
              to="/create-post"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
            >
              Create Post
            </Link>
          </div>
        )}

        {/* Posts feed */}
        {posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

// ====================================
// Create Post Page
// Form to create a new post with optional image
// ====================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../utils/api";

const CreatePost = () => {
  const navigate = useNavigate();

  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(""); // Image preview URL
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle image file selection — show a preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Only allow images
    if (!file.type.startsWith("image/")) {
      return setError("Please select an image file");
    }

    setImage(file);
    setPreview(URL.createObjectURL(file)); // Create local preview URL
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!caption.trim() && !image) {
      return setError("Please add a caption or image");
    }

    setLoading(true);

    try {
      // Use FormData because we're uploading a file
      const formData = new FormData();
      formData.append("caption", caption);
      if (image) formData.append("image", image);

      await API.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/dashboard"); // Go back to feed after posting
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Post</h2>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-4 text-sm">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Caption input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caption
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="What's on your mind?"
                rows={4}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              />
            </div>

            {/* Image upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image (optional)
              </label>

              {/* Custom file input */}
              <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-4xl">📷</div>
                    <p className="text-gray-400 text-sm mt-2">Click to select image</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {/* Remove image button */}
              {preview && (
                <button
                  type="button"
                  onClick={() => { setImage(null); setPreview(""); }}
                  className="mt-2 text-sm text-red-500 hover:underline"
                >
                  Remove image
                </button>
              )}
            </div>

            {/* Submit buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-semibold disabled:opacity-50"
              >
                {loading ? "Posting..." : "Share Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;

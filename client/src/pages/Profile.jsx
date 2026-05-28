// ====================================
// Profile Page
// Shows user info and their posts
// Can view own profile or other user's profile
// ====================================

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";

const Profile = () => {
  const { userId } = useParams(); // If visiting someone else's profile
  const { user: currentUser, updateUser } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");

  // Edit form state
  const [editData, setEditData] = useState({ name: "", bio: "" });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [saving, setSaving] = useState(false);

  // Determine whose profile to show
  const targetId = userId || currentUser._id;
  const isOwnProfile = targetId === currentUser._id;

  useEffect(() => {
    fetchProfile();
  }, [targetId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      // Fetch user info and their posts in parallel
      const [userRes, postsRes] = await Promise.all([
        API.get(isOwnProfile ? "/users/profile" : `/users/${targetId}`),
        API.get(`/users/${targetId}/posts`),
      ]);
      setProfileUser(userRes.data);
      setPosts(postsRes.data);
      setEditData({ name: userRes.data.name, bio: userRes.data.bio });
    } catch (err) {
      setError("Failed to load profile");
    }
    setLoading(false);
  };

  // Handle profile image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Save profile changes
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("bio", editData.bio);
      if (profileImageFile) formData.append("profileImage", profileImageFile);

      const res = await API.put("/users/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProfileUser(res.data.user);
      updateUser(res.data.user); // Update auth context
      setEditMode(false);
      setProfileImageFile(null);
      setImagePreview("");
    } catch (err) {
      setError("Failed to update profile");
    }

    setSaving(false);
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter((p) => p._id !== postId));
  };

  const handleUpdatePost = (postId, updatedFields) => {
    setPosts(posts.map((p) => (p._id === postId ? { ...p, ...updatedFields } : p)));
  };

  if (loading) return <div className="min-h-screen bg-gray-50"><Navbar /><Spinner /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-6">
        
        {/* ---- Profile Card ---- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          
          {error && (
            <div className="bg-red-50 text-red-600 rounded-lg px-4 py-2 mb-4 text-sm">
              {error}
            </div>
          )}

          {editMode ? (
            /* ---- Edit Mode ---- */
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Profile</h2>

              {/* Profile image upload in edit mode */}
              <div className="flex justify-center">
                <label className="cursor-pointer relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-200">
                    <img
                      src={imagePreview || profileUser?.profileImage || `https://ui-avatars.com/api/?name=${profileUser?.name}&background=3b82f6&color=fff`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm">
                    📷
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  maxLength={200}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                />
                <p className="text-xs text-gray-400 text-right">{editData.bio.length}/200</p>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setEditMode(false)} className="flex-1 border border-gray-300 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            /* ---- View Mode ---- */
            <div className="text-center">
              <img
                src={profileUser?.profileImage || `https://ui-avatars.com/api/?name=${profileUser?.name}&background=3b82f6&color=fff&size=128`}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold text-gray-800">{profileUser?.name}</h2>
              <p className="text-gray-500 text-sm mt-1">{profileUser?.email}</p>
              {profileUser?.bio && (
                <p className="text-gray-600 mt-3 max-w-sm mx-auto">{profileUser.bio}</p>
              )}
              <p className="text-blue-600 font-semibold mt-3">{posts.length} Posts</p>

              {/* Edit button for own profile */}
              {isOwnProfile && (
                <button
                  onClick={() => setEditMode(true)}
                  className="mt-4 border border-blue-300 text-blue-600 px-6 py-2 rounded-full hover:bg-blue-50 font-medium text-sm"
                >
                  ✏️ Edit Profile
                </button>
              )}
            </div>
          )}
        </div>

        {/* ---- User Posts ---- */}
        <h3 className="text-lg font-bold text-gray-700 mb-4">
          {isOwnProfile ? "Your Posts" : `${profileUser?.name}'s Posts`}
        </h3>

        {posts.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <div className="text-5xl mb-3">📭</div>
            <p>No posts yet</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onDelete={handleDeletePost}
              onUpdate={handleUpdatePost}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;

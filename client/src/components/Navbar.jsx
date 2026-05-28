// ====================================
// Navbar Component
// Shows at the top of every protected page
// ====================================

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
          🌐 SocialHub
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="text-gray-600 hover:text-blue-600 font-medium"
          >
            Feed
          </Link>
          <Link
            to="/create-post"
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 font-medium text-sm"
          >
            + Post
          </Link>
          <Link
            to="/profile"
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
          >
            {/* Show profile image or placeholder */}
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border-2 border-blue-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="hidden sm:block font-medium">{user?.name}</span>
          </Link>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-500 text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

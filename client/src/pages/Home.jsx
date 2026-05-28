// ====================================
// Home Page
// Landing page for non-logged-in users
// ====================================

import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex flex-col items-center justify-center text-white px-4">
      
      {/* Logo */}
      <div className="text-6xl mb-6">🌐</div>

      {/* Heading */}
      <h1 className="text-5xl font-bold mb-4 text-center">SocialHub</h1>
      <p className="text-xl text-blue-100 mb-2 text-center">
        Connect. Share. Inspire.
      </p>
      <p className="text-blue-200 mb-10 text-center max-w-md">
        A simple social media platform where you can share your thoughts, photos, and connect with people.
      </p>

      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          to="/register"
          className="bg-white text-blue-700 px-8 py-3 rounded-full font-bold text-lg hover:bg-blue-50 shadow-lg"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="border-2 border-white text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white hover:text-blue-700"
        >
          Login
        </Link>
      </div>

      {/* Features list */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {[
          { icon: "📝", label: "Share Posts" },
          { icon: "❤️", label: "Like & Comment" },
          { icon: "📷", label: "Upload Images" },
          { icon: "👤", label: "Custom Profile" },
        ].map((f) => (
          <div key={f.label} className="bg-white/10 rounded-xl p-4">
            <div className="text-3xl mb-2">{f.icon}</div>
            <p className="text-sm font-medium">{f.label}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <p className="mt-16 text-blue-300 text-sm">
        PRODIGY_FS_05 — Full Stack Internship Project
      </p>
    </div>
  );
};

export default Home;

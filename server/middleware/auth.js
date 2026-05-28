// ====================================
// Auth Middleware
// Protects routes that require login
// ====================================

const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  // Get the token from request headers
  // Frontend sends: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, access denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to the request object
    req.user = decoded;
    next(); // Move on to the actual route handler
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { protect };

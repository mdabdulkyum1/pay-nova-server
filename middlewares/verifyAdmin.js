const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const verifyAdmin = async (req, res, next) => {
  try {
    // Get the token from headers
    const token = req.headers.authorization?.split(" ")[1];
   
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user by ID and validate session
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.session !== decoded.session) {
      return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
    }

    // Check if user has an admin role
    if (user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied. Admins only." });
    }

    req.user = user; // Attach user info to request
    next(); // Proceed to next middleware or route handler
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized", error: error.message });
  }
};

module.exports = verifyAdmin;

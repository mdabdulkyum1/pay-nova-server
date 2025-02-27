const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Admin = require("../models/adminModel");

const verifyAdmin = async (req, res, next) => {
  try {
    // Get the token from headers
    const token = req.headers.authorization?.split(" ")[1];

    console.log("test",token)

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID in User or Admin collection
    let user = await User.findById(decoded.id).select("-pin"); // Exclude PIN field
    if (!user) {
      user = await Admin.findById(decoded.id).select("-pin");
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Validate session
    if (user.session !== decoded.session) {
      return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
    }

    // Check if user is an admin or super-admin
    if (user.role !== "admin" && user.role !== "super-admin") {
      return res.status(403).json({ success: false, message: "Access denied. Admins only." });
    }

    // Attach user info to request and proceed
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized", error: error.message });
  }
};

module.exports = verifyAdmin;

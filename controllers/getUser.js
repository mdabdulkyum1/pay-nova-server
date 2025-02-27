const User = require("../models/userModel");
const Admin = require("../models/adminModel");
const jwt = require("jsonwebtoken");

const getUser = async (req, res) => {
  try {
    // Get token from headers
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check user role and find user in respective collection
    let user = await User.findById(decoded.id).select("-pin"); // Exclude PIN field
    let role = "user"; // Default role

    if (!user) {
      user = await Admin.findById(decoded.id).select("-pin"); // Try finding in Admin collection
      if (user) role = user?.role; // If found in Admin collection, set role
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ 
      success: true, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role, // Include user role in response
        amount: user.amount || user.totalIncome
      } 
    });

  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token", error: error.message });
  }
};

  const getAdmin = async (req, res) => {
  try {
      const email = req.params.email || req.user?.email;
      if (!email) {
          return res.status(400).json({ message: "Email is required" });
      }

      // Find the user by email in User collection
      let user = await User.findOne({ email }).select("-pin"); // Exclude PIN field
      let role = "user"; // Default role

      // If not found in User collection, check in Admin collection
      if (!user) {
          user = await Admin.findOne({ email }).select("-pin"); // Try finding in Admin collection
          if (user) role = user.role; // If found in Admin collection, set role
      }

      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }

      // If no role is provided for update, return the current role
      res.json({ role });
  } catch (error) {
      console.error("Error fetching or updating admin role:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};


const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find().select("-pin"); // Exclude password for security

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};




module.exports = {
  getUser,
  getAdmin,
  getAllUsers
};

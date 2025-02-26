const User = require("../models/userModel");
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

    // Find user by ID
    const user = await User.findById(decoded.id).select("-pin"); // Exclude the PIN field


    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
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

      const user = await User.findOne({ email });

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      res.json({ role: user.role });
  } catch (error) {
      console.error("Error fetching admin role:", error);
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

const { v4: uuidv4 } = require('uuid'); 
const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerAdmin = async (req, res) => {
    try {
        const { name, pin, mobile, email, role } = req.body;

        // Check if the mobile number or email is already registered
        const existingAdmin = await Admin.findOne({ $or: [{ mobile }, { email }] });

        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: "Admin with this mobile number or email already exists",
            });
        }

        // Hash the PIN
        const hashedPin = await bcrypt.hash(pin, 10);

        // Create a new admin
        const newAdmin = new Admin({
            name,
            pin: hashedPin, // Store hashed PIN
            mobile,
            email,
            role: role || 'admin', // Default to 'admin' if role is not provided
        });

        // Save admin to the database
        const savedAdmin = await newAdmin.save();

        res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            data: savedAdmin,
        });

    } catch (error) {
        console.error("Error registering admin:", error);
        res.status(500).json({
            success: false,
            message: "Admin registration failed",
            error: error.message,
        });
    }
};

const loginAdmin = async (req, res) => {
    try {
        const { email, pin, mobile } = req.body;

        // Find admin by email or mobile
        const admin = await Admin.findOne({ $or: [{ email }, { mobile }] });

        if (!admin || !(await bcrypt.compare(pin, admin.pin))) {
            return res.status(400).json({
                success: false,
                message: "Invalid login credentials",
            });
        }

        // Generate session using UUID
        const sessionToken = uuidv4(); // Generate a unique session ID


        admin.session = sessionToken;
        await admin.save();


        // Generate JWT token including admin ID and session
        const token = jwt.sign({ id: admin._id, session: sessionToken, role: admin.role }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRED || '7d', // Default to 7 days if not set
        });

        return res.status(200).json({
            success: true,
            message: "Admin logged in successfully",
            data: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                session: sessionToken,
                token, // JWT token
            },
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            success: false,
            message: "Admin login failed",
            error: error.message,
        });
    }
};

const getAdmin = async (req, res) => {
    try {
        const email = req.params.email || req.user?.email;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
  
        const user = await Admin.findOne({ email });
  
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
  
        res.json({ role: user.role });
    } catch (error) {
        console.error("Error fetching admin role:", error);
        res.status(500).json({ message: "Internal server error" });
    }
  };

  
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

module.exports = { registerAdmin, loginAdmin, getAdmin, getUser };

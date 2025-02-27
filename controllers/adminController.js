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

module.exports = { registerAdmin, loginAdmin };

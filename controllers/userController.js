
const { v4: uuidv4 } = require('uuid'); 
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



const registerUser = async (req, res) => {
    try {
        const {
            name,
            pin,
            mobile,
            email,
            role,
            nid,
            photoURL,
            session
        } = req.body;

        // Hash the PIN
        const hashedPassword = await bcrypt.hash(pin, 10);

        // Create a new user with a 40 Taka bonus
        const newUser = new User({
            name,
            pin: hashedPassword, // Store hashed pin
            mobile,
            email,
            role,
            nid,
            photoURL,
            session,
            amount: 40 
        });

        // Save user to the database
        const newUserInfo = await newUser.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully with 40 Taka bonus",
            data: newUserInfo
        });

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({
            success: false,
            message: "User registration failed",
            error: error.message
        });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, pin, mobile } = req.body;

        // Find user by email or mobile
        const user = await User.findOne({ email }) || await User.findOne({ mobile });
   

        // Check if user exists and pin matches
        if (!user || !(await bcrypt.compare(pin, user.pin))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid login credentials',
            });
        }

        // Generate session using UUID
        const sessionToken = uuidv4(); // Generate a unique session ID

        // Update user session in the database
        user.session = sessionToken;
        await user.save();

        // Generate JWT token including user id and session
        const token = jwt.sign({ id: user._id, session: sessionToken }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRED || '7d', // Default to 7 days if not set
        });

        // Send the response with user data, token, and session
        return res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                session: sessionToken, // Include session info
                token, // JWT with session
            },
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            success: false,
            message: 'User login failed',
            error: error.message,
        });
    }
};


const logoutUser = async (req, res) => {
    try {
        const user = req.user; // This comes from the 'verifySession' middleware

        // Clear the session or update it to indicate the user is logged out
        user.session = null; // or set session to another value (e.g., an empty string)
        await user.save(); // Save the user object to the database

        // Respond back with a success message
        return res.status(200).json({
            success: true,
            message: "User logged out successfully",
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            success: false,
            message: "Error logging out user",
            error: error.message,
        });
    }
};






module.exports = {
    registerUser,
    loginUser,
    logoutUser
};
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
    try {
        const { name, pin, mobile, email, role, nid, photoURL, session, amount } = req.body;
        
        const hashedPassword = await bcrypt.hash(pin, 10);

        // Create new user
        const newUser = new User({
            name,
            pin: hashedPassword, // Store hashed pin
            mobile,
            email,
            role,
            nid,
            photoURL,
            session,
            amount: amount || 0 // Ensure amount is set to 0 if not provided
        });

        // Save user to database
        const newUserInfo = await newUser.save();



        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: newUserInfo
        });

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({
            success: false,
            message: "User registration failed",
            error
        });
    }
};

module.exports = { registerUser };

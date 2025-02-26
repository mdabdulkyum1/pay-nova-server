const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Admin = require("../models/adminModel");

const verifySession = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check for user in both Users & Admins collections
        let user = await User.findById(decoded.id);
        let role = "user"; // Default role

        if (!user) {
            user = await Admin.findById(decoded.id);
            if (user) role = "admin";
        }

        if (!user || user.session !== decoded.session) {
            return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
        }

        req.user = user; // Attach user/admin info to the request
        req.user.role = role; // Attach role info (user or admin)
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Unauthorized", error: error.message });
    }
};

module.exports = verifySession;

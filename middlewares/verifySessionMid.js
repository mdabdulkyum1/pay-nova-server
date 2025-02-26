const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const verifySession = async (req, res, next) => {

    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).send({ success: false, message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        
        const user = await User.findById(decoded.id);
 
        if (!user || user.session !== decoded.session) {
            return res.status(401).send({ success: false, message: "Session expired. Please log in again." });
        }

        req.user = user; // Attach user info to the request
        next();
    } catch (error) {
        return res.status(401).send({ success: false, message: "Unauthorized", error: error.message });
    }
};

module.exports = verifySession;

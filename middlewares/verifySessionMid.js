const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const verifySession = async (req, res, next) => {

    try {
        const token = req.headers.authorization?.split(" ")[1];
      

        if (!token) {
            return res.status(401).send({ success: false, message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)
        
        const user = await User.findById(decoded.id);
 

        // Check if the session ID matches the one stored in the database
        console.log("user session",  user.session);
        // 260882c5-bc04-4e45-bce6-48216c79b49d
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

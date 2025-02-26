const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/userController');
const { getUser, getAdmin, getAllUsers } = require('../controllers/getUser');
const router = express.Router();
const verifySession = require('../middlewares/verifySessionMid'); 
const verifyAdmin = require('../middlewares/verifyAdmin'); 

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', verifySession, logoutUser);


router.get("/auth/me", verifySession, getUser); 
router.get("/users/role/:email", verifySession, verifyAdmin,  getAdmin); 
router.get("/users", verifySession, verifyAdmin,  getAllUsers); 

module.exports = router;

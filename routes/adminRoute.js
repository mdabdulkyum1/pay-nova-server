const express = require('express');
const {registerAdmin, loginAdmin} = require('../controllers/adminController')


const router = express.Router();
const verifySession = require('../middlewares/verifySessionMid'); 
const verifyAdmin = require('../middlewares/verifyAdmin'); 


// router.post("/register/admin", registerAdmin)
router.post("/login/admin", loginAdmin)


module.exports = router;
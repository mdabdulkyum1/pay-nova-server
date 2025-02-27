const express = require('express');
const {registerAdmin, loginAdmin} = require('../controllers/adminController')


const router = express.Router();

// router.post("/register/admin", registerAdmin)
router.post("/login/admin", loginAdmin)


module.exports = router;
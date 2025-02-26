const express = require('express');
const transactionPost = require("../controllers/transactions")


const router = express.Router();

router.post('/transactions',  transactionPost)
router.get('/transactions/:id',  )


module.exports = router;
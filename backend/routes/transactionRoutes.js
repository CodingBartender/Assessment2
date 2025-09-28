// routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Add executed transaction
router.post('/', transactionController.addTransaction); // create transaction
router.get('/buyer/:buyerId', transactionController.getTransactionsByBuyer); // get transactions for buyer
router.get('/stock/:stockId', transactionController.getTransactionsByStock); // get transactions for stock

module.exports = router;

// controllers/transactionController.js
const transactionRepo = require('../repository/transactionRepository');

exports.addTransaction = async (req, res) => {
    try {
        const transaction = await transactionRepo.addTransaction(req.body);
        res.status(201).json(transaction);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getTransactionsByBuyer = async (req, res) => {
    try {
        const transactions = await transactionRepo.getTransactionsByBuyer(req.params.buyerId);
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTransactionsByStock = async (req, res) => {
    try {
        const transactions = await transactionRepo.getTransactionsByStock(req.params.stockId);
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

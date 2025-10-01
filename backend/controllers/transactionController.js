// controllers/transactionController.js
const transactionRepo = require('../repository/transactionRepository');
const Stock = require('../models/Stock');
const EventHub = require('../observer/EventHub');

exports.addTransaction = async (req, res) => {
    try {
        const transaction = await transactionRepo.addTransaction(req.body);

        // Adjust stock quantity per transaction type (BUY decreases, SELL increases)
        const stock = await Stock.findById(tx.stock_id);
        if (stock) {
            const qty = Number(tx.quantity) || 0;
            if (tx.transaction_type === 'BUY') stock.quantity = Math.max(0, Number(stock.quantity) - qty);
            if (tx.transaction_type === 'SELL') stock.quantity = Number(stock.quantity) + qty;
            stock.last_updated = new Date();
            await stock.save();

            // broadcast trade and new snapshot
            EventHub.instance.emit('stock.t
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
            EventHub.instance.emit('stock.traded', {
                symbol: stock.symbol, transaction_type: tx.transaction_type, quantity: qty, price: Number(tx.price),
                newQuantity: stock.quantity,
            });
            EventHub.instance.emit('stock.updated', {
                _id: stock._id, symbol: stock.symbol, company_name: stock.company_name,
                current_price: stock.current_price, quantity: stock.quantity, last_updated: stock.last_updated,
            });
            }

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

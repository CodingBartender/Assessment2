const transactionRepo = require('../repository/transactionRepository');
const Stock = require('../models/Stock');
const EventHub = require('../observer/EventHub');

exports.addTransaction = async (req, res) => {
    try {
        const transaction = await transactionRepo.addTransaction(req.body);

        // Load the stock and adjust quantity per transaction type
        const stock = await Stock.findById(transaction.stock_id);
        if (stock) {
            const qty = Number(transaction.quantity) || 0;

            // BUY: market float decreases; SELL: market float increases
            if (transaction.transaction_type === 'BUY') {
                stock.quantity = Math.max(0, Number(stock.quantity) - qty);
         }
            if (transaction.transaction_type === 'SELL') {
                stock.quantity = Number(stock.quantity) + qty;
         }

            stock.last_updated = new Date();
            await stock.save();

            // Broadcast trade + updated snapshot for FR6 live UI
            EventHub.instance.emit('stock.traded', {
                symbol: stock.symbol,
                transaction_type: transaction.transaction_type,
                quantity: qty,
                price: Number(transaction.price),
                newQuantity: stock.quantity,
            });

            EventHub.instance.emit('stock.updated', {
                _id: stock._id,
                symbol: stock.symbol,
                company_name: stock.company_name,
                current_price: stock.current_price,
                quantity: stock.quantity,
                last_updated: stock.last_updated,
            });
        }

        return res.status(201).json(transaction);
    } catch (err) {
        return res.status(400).json({ error: err.message });
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

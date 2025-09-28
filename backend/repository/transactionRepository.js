// repositories/transactionRepository.js
const Transaction = require('../models/Transaction');

class TransactionRepository {
  // 1️⃣ Add a new transaction (record executed order)
  async addTransaction(transactionData) {
    const transaction = new Transaction(transactionData);
    return await transaction.save();
  }

  // 2️⃣ (Optional) Get all transactions for a buyer
  async getTransactionsByBuyer(buyerId) {
    return await Transaction.find({ buyer_id: buyerId })
      .populate('stock_id', 'symbol company_name current_price')
      .populate('portfolio_id', 'virtual_balance')
      .populate('order_id', 'status created_at')
      .sort({ executed_at: -1 }); // latest first
  }

  // 3️⃣ (Optional) Get all transactions for a stock
  async getTransactionsByStock(stockId) {
    return await Transaction.find({ stock_id: stockId })
      .populate('buyer_id', 'username')
      .populate('portfolio_id', 'virtual_balance')
      .populate('order_id', 'status created_at')
      .sort({ executed_at: -1 });
  }
}

module.exports = new TransactionRepository();

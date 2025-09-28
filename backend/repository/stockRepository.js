// repositories/stockRepository.js
const Stock = require('../models/Stock');
const Order = require('../models/Order');

class StockRepository {
    // Create
    async createStock(stockData) {
        const stock = new Stock(stockData);
        return await stock.save();
    }

    // Read All
    async getAllStocks() {
        return await Stock.find().populate('trader_id', 'name email');
    }

    // Read One
    async getStockById(stockId) {
        return await Stock.findById(stockId).populate('trader_id', 'name email');
    }

    // Update
    async updateStock(stockId, updateData) {
        updateData.last_updated = new Date();
        return await Stock.findByIdAndUpdate(stockId, updateData, { new: true });
    }

    // Delete
    async deleteStock(stockId) {
        return await Stock.findByIdAndDelete(stockId);
    }

     // Count how many orders exist for a stock
  async getOrderCount(stockId) {
    return await Order.countDocuments({ stock_id: stockId });
  }

  // Get all orders for a particular stock
  async getOrdersForStock(stockId) {
    return await Order.find({ stock_id: stockId })
      .populate('buyer_id', 'username')
      .populate('portfolio_id', 'virtual_balance')
      .populate('stock_id', 'symbol company_name current_price')
      .sort({ created_at: -1 }); // latest orders first
  }
}

module.exports = new StockRepository();

// controllers/stockController.js
const stockRepo = require('../repository/stockRepository');

exports.createStock = async (req, res) => {
  try {
    const stock = await stockRepo.createStock(req.body);
    res.status(201).json(stock);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllStocks = async (req, res) => {
  try {
    const stocks = await stockRepo.getAllStocks();
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStockById = async (req, res) => {
  try {
    const stock = await stockRepo.getStockById(req.params.id);
    if (!stock) return res.status(404).json({ error: 'Stock not found' });
    res.json(stock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const stock = await stockRepo.updateStock(req.params.id, req.body);
    if (!stock) return res.status(404).json({ error: 'Stock not found' });
    res.json(stock);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteStock = async (req, res) => {
  try {
    const stock = await stockRepo.deleteStock(req.params.id);
    if (!stock) return res.status(404).json({ error: 'Stock not found' });
    res.json({ message: 'Stock deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// New methods for order statistics
exports.getOrderCount = async (req, res) => {
  try {
    const count = await stockRepo.getOrderCount(req.params.id);
    res.json({ stock_id: req.params.id, order_count: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrdersForStock = async (req, res) => {
  try {
    const orders = await stockRepo.getOrdersForStock(req.params.id);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

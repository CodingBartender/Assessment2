// controllers/stockController.js
const stockRepo = require('../repository/stockRepository');
const EventHub = require('../observer/EventHub'); 
const pricing = require('../strategy/PricingStrategy');
const fs = require('fs');
const path = require('path');

exports.createStock = async (req, res) => {
  try {
    let stockData = req.body;
    if (req.file) {
      stockData.logo = `/uploads/${req.file.filename}`;
    }
    
    const strategy = pricing.getPricingStrategy();
    const nextPrice = strategy.compute({
      current: Number(req.body.current_price),
      signal: Number(req.body.current_price), // Trader’s intended price
    });
    const payload = {
      ...req.body,
      current_price: nextPrice,
      last_updated: new Date(),
    };
    const stock = await stockRepo.createStock(payload);

    //broadcast snapshot
    EventHub.instance.emit('stock.updated', {
      _id: stock._id, symbol: stock.symbol, company_name: stock.company_name,
      current_price: stock.current_price, quantity: stock.quantity, last_updated: stock.last_updated,
    });

    res.status(201).json(stock);
  } catch (err) {
    res.status(400).json({ error: err.message });}
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
    let updateData = req.body;
    if (req.file) {
      updateData.logo = `/uploads/${req.file.filename}`;
    }
    
    const strategy = pricing.getPricingStrategy();
    const changes = { ...req.body };

    if (req.body.current_price !== undefined) {
      // current = existing price, signal = requested price
      const existing = await stockRepo.getStockById(req.params.id);
      const nextPrice = strategy.compute({
        current: Number(existing?.current_price),
        signal: Number(req.body.current_price),
      });
      changes.current_price = nextPrice;
      changes.last_updated = new Date();
    }
    const stock = await stockRepo.updateStock(req.params.id, updateData);
    if (!stock) return res.status(404).json({ error: 'Stock not found' });

    //broadcast snapshot
    EventHub.instance.emit('stock.updated', {
      _id: stock._id, symbol: stock.symbol, company_name: stock.company_name,
      current_price: stock.current_price, quantity: stock.quantity, last_updated: stock.last_updated,
    });

    res.json(stock);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteStock = async (req, res) => {
  try {
    // Find stock first to get logo path
    const stock = await stockRepo.getStockById(req.params.id);
    if (!stock) return res.status(404).json({ error: 'Stock not found' });

    // Delete image file if exists
    if (stock.logo) {
      const logoPath = path.join(__dirname, '../', stock.logo);
      console.log("Deleting file at path: ", logoPath);
      fs.unlink(logoPath, err => {
        // Ignore error if file doesn't exist
      });
    }

    await stockRepo.deleteStock(req.params.id);

    // FR6: broadcast removal so SSE clients drop it
    EventHub.instance.emit('stock.deleted', { _id: req.params.id, symbol: stock.symbol });

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

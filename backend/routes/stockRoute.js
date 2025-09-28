// routes/stockRoutes.js
const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

// CRUD
router.post('/', stockController.createStock); // create stock
router.get('/', stockController.getAllStocks); // get all stocks
router.get('/:id', stockController.getStockById); // get stock by id
router.put('/:id', stockController.updateStock); // update stock
router.delete('/:id', stockController.deleteStock); // delete stock
router.get('/:id/orders/count', stockController.getOrderCount);  // total orders
router.get('/:id/orders', stockController.getOrdersForStock);   // all orders for stock

module.exports = router;
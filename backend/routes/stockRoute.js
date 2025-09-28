// routes/stockRoutes.js
const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '../uploads'));
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname);
	}
});
const upload = multer({ storage });

// CRUD
router.post('/addStock', upload.single('logo'), stockController.createStock); // create stock with logo
router.get('/getAllStocks', stockController.getAllStocks); // get all stocks
router.get('/stocks/:id', stockController.getStockById); // get stock by id
router.put('/updateStock/:id', upload.single('logo'), stockController.updateStock); // update stock with logo
router.delete('/delete/:id', stockController.deleteStock); // delete stock
router.get('/stocks/:id/orders/count', stockController.getOrderCount);  // total orders
router.get('/stocks/:id/orders', stockController.getOrdersForStock);   // all orders for stock


module.exports = router;
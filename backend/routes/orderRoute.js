// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// CRUD for orders (restricted to logged-in buyer)
router.post('/create', orderController.createOrder);
router.get('/getOrdersByUserId/:id', orderController.getOrders); // get order by user id
router.get('/totalQuantity/:buyerId', orderController.getTotalOrderQuantityByBuyer); // get total order quantity for buyer
router.get('/getbyOrderIdAndUserID/:id', orderController.getOrderById);
router.put('/:id', orderController.updateOrder);
router.delete('/delete/:id', orderController.deleteOrder);
router.put('/:id/cancel', orderController.cancelOrder);

module.exports = router;

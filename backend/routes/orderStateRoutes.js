const express = require('express');
const { placeNewOrder, fetchMyOrders, changeOrderStatus } = require('../controllers/orderStateController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .post(protect, placeNewOrder)   
  .get(protect, fetchMyOrders);   
router.route('/:id/status')
  .put(protect, changeOrderStatus);

module.exports = router;

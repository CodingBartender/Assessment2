const Order = require('../models/OrderState');


const placeNewOrder = async (req, res) => {
  try {
    const { stockName, shares, unitPrice, type } = req.body;

    // tie this order to the user
    const order = await Order.create({
      userRef: req.user.id,
      stockName,
      shares,
      unitPrice,
      type
    });

    res.status(201).json(order);
  } catch (err) {
    // show error message
    res.status(500).json({ message: err.message });
  }
};

// show all orders belonging to the current user
const fetchMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userRef: req.user.id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// change the order status (new -- pending -- executed/cancelled)
const changeOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = req.body.status || order.status;

    if (order.status === 'Executed') {
      order.executedAt = new Date();
    }

    const updated = await order.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { placeNewOrder, fetchMyOrders, changeOrderStatus };

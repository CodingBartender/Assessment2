// controllers/orderController.js
const orderRepo = require('../repository/orderRepository');

exports.createOrder = async (req, res) => {
  try {
    const orderData = { ...req.body, buyer_id: req.user.id }; // assume req.user is set by auth middleware
    const order = await orderRepo.createOrder(orderData);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await orderRepo.getOrdersByUser(req.user.id);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await orderRepo.getOrderById(req.params.id, req.user.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await orderRepo.updateOrder(req.params.id, req.user.id, req.body);
    if (!order) return res.status(404).json({ error: 'Order not found or not yours' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await orderRepo.deleteOrder(req.params.id, req.user.id);
    if (!order) return res.status(404).json({ error: 'Order not found or not yours' });
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await orderRepo.cancelOrder(req.params.id, req.user.id);
    if (!order) return res.status(404).json({ error: 'Order not found or not yours' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

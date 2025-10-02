//  FR-10: Order State Tracking Controller
// Controller uses the State Pattern to update order status


const orderRepo = require('../repository/orderRepository');
const { PendingState, ExecutedState, CancelledState, SoldState } = require('../states/orderStatus');

exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    const userId = req.user?.id || req.body.user_id;

    if (!status) return res.status(400).json({ error: "status is required" });

    const order = await orderRepo.getOrderById(orderId, userId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    // state design pattern is applied here
    let state;
    switch (status) {
      case "Pending":   state = new PendingState(order); break;
      case "Executed":  state = new ExecutedState(order); break;
      case "Cancelled": state = new CancelledState(order); break;
      case "Sold":      state = new SoldState(order); break;
      default: return res.status(400).json({ error: "Invalid status" });
    }

    // polymorphism is applied here

    const updated = state.execute(); 
    await updated.save();

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

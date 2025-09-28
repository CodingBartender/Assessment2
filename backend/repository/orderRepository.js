// repositories/orderRepository.js
const Order = require('../models/Order');
const portfolioRepo = require('../repository/portfolioRepositry');

class OrderRepository {
    async createOrder(orderData) {
        const { portfolio_id, price, quantity } = orderData;
        const orderAmount = price * quantity;

        // Decrease buyer's balance when placing an order
        const updatedPortfolio = await portfolioRepo.decreaseBalance(portfolio_id, orderAmount);
        if (!updatedPortfolio || updatedPortfolio.virtual_balance < 0) {
            throw new Error('Insufficient balance to place order');
        }

        const order = new Order(orderData);
        return await order.save();
    }

    async getOrdersByUser(userId) {
        return await Order.find({ buyer_id: userId })
            .populate('stock_id', 'symbol company_name current_price')
            .populate('portfolio_id', 'virtual_balance');
    }

    async getOrderById(orderId, userId) {
        return await Order.findOne({ _id: orderId, buyer_id: userId })
            .populate('stock_id', 'symbol company_name current_price')
            .populate('portfolio_id', 'virtual_balance');
    }

    async updateOrder(orderId, userId, updateData) {
        return await Order.findOneAndUpdate(
            { _id: orderId, buyer_id: userId },
            updateData,
            { new: true }
        );
    }

    async cancelOrder(orderId, userId) {
        const order = await Order.findOne({ _id: orderId, buyer_id: userId });
        if (!order) return null;

        if (order.status !== 'Pending') {
            throw new Error('Only pending orders can be cancelled');
        }

        // Refund buyer’s balance
        const refundAmount = order.price * order.quantity;
        await portfolioRepo.increaseBalance(order.portfolio_id, refundAmount);

        order.status = 'Cancelled';
        await order.save();
        return order;
    }

    async deleteOrder(orderId, userId) {
        return await Order.findOneAndDelete({ _id: orderId, buyer_id: userId });
    }
}

module.exports = new OrderRepository();


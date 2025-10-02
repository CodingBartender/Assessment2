const accessOrderRepo = require('../repository/orderRepository');
const command = require('../commands/command');

class sellOrderCommand extends command {

    constructor(order) {
       
        this.order = order;

    };

    async Execute() {

        // Updating sold order to "Executed"
        this.order.updateData = { status: "Executed" };

        // Accessing parametres to pass through updateOrder
        const { orderId, userId, updateData } = this.order;

        // Accessing stored data
        const orderExecute = await accessOrderRepo.updateOrder( orderId, userId, updateData );
        return orderExecute;

    };

    async Undo() {

        this.order.updateData = { status: "Pending" };

        const { orderId, userId, updateData } = this.order;

        const orderUndo = await accessOrderRepo.updateOrder( orderId, userId, updateData );
        return orderUndo;

    };
}

module.exports = sellOrderCommand;

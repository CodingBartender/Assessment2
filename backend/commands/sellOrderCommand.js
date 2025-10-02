const accessOrderRepo = require('../repository/orderRepository');
const command = require('../commands/command');

class sellOrderCommand extends command {

    constructor(orderId, userId) {
        this.orderData = {orderId, userId}
    };

    async Execute() {

        const sellExecute = await accessOrderRepo.cancelOrder(this.orderData)
        return sellExecute

    };

    async Undo() {


    };
}
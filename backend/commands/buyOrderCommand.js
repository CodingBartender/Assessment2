const accessOrderRepo = require('../repository/orderRepository');
const command = require('../commands/command');

class buyOrderCommand extends command {

    // Store data from repo 
    constructor(order) {

        this.order = order;

    };

    async Execute() {


        // Accessing stored data 
        const orderExecute = await accessOrderRepo.createOrder(this.order);
        
        // Need to access cancelOrder(orderId, userId) parametres -> access through orderExecute 
        this.accessIds = orderExecute;
        return orderExecute;
        
    };

    async Undo() {

        // Assigning the parametres values to pass through cancelOrder 
        const orderId = this.accessIds._id
        const userId = this.accessIds.buyer_id

        // Undoing order through accessing orderrepo 
        const orderUndo = await accessOrderRepo.cancelOrder(orderId, userId)
        return orderUndo
    };
};

module.exports = buyOrderCommand;
const accessOrderRepo = require('../repository/orderRepository');
const command = require('../commands/command');



class buyOrderCommand extends command {

    // Store data from repo 
    constructor(orderData) {

        this.orderData = orderData

    };

    // Use stored data and return order 
    async Execute() {

        // Accessing stored data //
        const buyExecute = await accessOrderRepo.createOrder(this.orderData)
        
        // Need to access cancelOrder(orderId, userId) parametres -> access through buyExecute 
        this.accessIds = buyExecute

        return buyExecute
        
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
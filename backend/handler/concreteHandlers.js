const handler = require('../handler/baseHandler');
// const orderRepo = require('../repository/orderRepository');
// const orderDB = require('../models/Order');
const user = require('../models/User');
const portfolio = require('../models/Portfolio');
const stock = require('../models/Stock');

// Concrete handlers
// buyer_id -> checks buyer exists in database (Orders.js)
class buyer_idValidate extends handler {
   async handle(request) {

      //const buyer_idData = await orderDB.findById(request.buyer_id)
      // If request doesn't match buyer_id validation return false and error message

        const userId = await user.findById(request.buyer_id);

        if (!userId) {
            throw new Error ('Buyer_id is incorrect!');
        };
        // Continue to next in chain
        return super.handle(request);
    };
};

// portfolio_id -> checks portfolio exists in database (Portfolio,js)
class portfolio_id extends handler {
    async handle(request) {
        const portfolioData = await portfolio.findById(request.portfolio_id);
        if (!portfolioData) {
            throw new Error ('Portfolio_id is incorrect!');
        };
        return super.handle(request);
    };
};

// stock_id -> checks stock exists in database (Stock.js)
class stock_id extends handler {
    async handle(request) {
        const stockData = await stock.findById(request.stock_id);
        if (!stockData) {
            throw new Error ('Stock_id is incorrect!');
        };
        return super.handle(request);
    };
};

class order_type extends handler {
    async handle(request) {
        const orderType = (['BUY', 'SELL']);
        // Check string is in array, array . includes -> request.string
        if (!orderType.includes(request.order_type)) {
            throw new Error ('Order_type must be BUY or SELL!');
        };
        return super.handle(request);
    };
};

class quantity extends handler {
    async handle(request) {

        const illegalQty = 0;
        // quantity > 0
        if (request.quantity < illegalQty) {
            throw new Error ("Quantity must be greater than 0!");
        };
        // quantity != 0
        if (request.quantity == illegalQty) {
            throw new Error ("Quantity must have atleast 1 share!");
        };
        return super.handle(request);
    };
};

class price extends handler {
    async handle(request) {

        const illegalPrice = 0;
        if (request.price < illegalPrice) {
            throw new Error ("Price must be greater than $0!");
        };
        return super.handle(request);
    };
};

class status extends handler {
    async handle(request) {

        const statusType = (['Pending', 'Executed', 'Cancelled', 'Sold']);
        if (!statusType.includes(request.status)) {
            throw new Error ("Status must not be pending!");
        };
        return super.handle(request);
    };
};


// Update exports
module.exports = {buyer_idValidate, portfolio_id, stock_id, order_type, quantity, price, status};


const validationHandler = require("../handler/concreteHandlers");
const buyOrderCommand = require("../commands/buyOrderCommand");
const sellOrderCommand = require("../commands/sellOrderCommand");
const state = require("../states/baseState");
const portfolioRepo = require("../repository/portfolioRepositry");

class pendingState extends state {

    async Validate() {

        if (this.order.status !== 'Pending') {
            throw new Error ("This order must be pending to validate it's contents");
        };

        const validateBuyer_Id = new validationHandler.buyer_idValidate();
        const validatePortfolio_Id = new validationHandler.portfolio_id();
        const validateStock_Id = new validationHandler.stock_id();
        const validateOrder_type = new validationHandler.order_type();
        const validateQuantity = new validationHandler.quantity();
        const validatePrice = new validationHandler.price();

        // Setting up Chain of Responsibility
        validateBuyer_Id
            .setNext(validatePortfolio_Id)
            .setNext(validateStock_Id)
            .setNext(validateOrder_type)
            .setNext(validateQuantity)
            .setNext(validatePrice)
        
        await validateBuyer_Id.handle(this.order);

        // Validated
        this.order.status = 'Validated';
        
    };

};


class validatedState extends state {

    async Execute() {

        if (this.order.status !== 'Validated') {
            throw new Error ("Order must be validated!");
        };

        if (this.order.order_type === "BUY") {
            const buyCommand = new buyOrderCommand(this.order);
            await buyCommand.Execute();

        } else if (this.order.order_type === "SELL") {
            const sellCommand = new sellOrderCommand(this.order);
            await sellCommand.Execute();
        };
        this.order.status = 'Executed';

    };

};


class executedState extends state {
    
    async Execute() {

        if (this.order.status !== 'Executed') {
            throw new Error ("Order must be executed!");
        };

        const orderAmount = this.order.price * this.order.quantity;

        if (this.order.order_type === "BUY") {
            await portfolioRepo.decreaseBalance(this.order.portfolio_id, orderAmount);
        } else if (this.order.order_type === "SELL") {
            await portfolioRepo.increaseBalance(this.order.portfolio_id, orderAmount);
        };
        
    }

};

class cancelledState extends state {

    async Cancel() {

        if (this.order.status !== 'Cancelled') {
            throw new Error ("Order must be cancelled!");
        };

        if (this.order.order_type === 'BUY') {
            const buyCommand = new buyOrderCommand(this.order);
            await buyCommand.Undo();
        } else if (this.order.order_type === 'SELL') {
            const sellCommand = new sellOrderCommand(this.order);
            await sellCommand.Undo();
        };
        
    };
};

module.exports = { pendingState, validatedState, executedState, cancelledState };


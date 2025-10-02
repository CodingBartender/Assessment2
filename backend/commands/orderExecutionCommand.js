const command = require("../commands/command");
const states = require("../states/concreteStates");

class orderExecuteCommand extends command {

    constructor(order) {
        // Call parent command constructor
        super();
        this.order = order;
    };

    async Execute() {

        const pending = new states.pendingState(this.order);
        await pending.Validate();

        const validate = new states.validatedState(this.order);
        await validate.Execute();

        const execute = new states.executedState(this.order);
        await execute.Execute();

        return this.order;

    };

    async Undo() {

        const cancel = new states.cancelledState(this.order);
        await cancel.Cancel();

        return this.order;

    };
};

module.exports = orderExecuteCommand;
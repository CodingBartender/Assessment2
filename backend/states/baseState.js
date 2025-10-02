class State {

    constructor(order) {

        this.order = order;
    }

    async validate() {

        throw new Error ("Validate method has to be used!");
    };

    async execute() {

        throw new Error ("Execute method has to be used!");
    };

    async cancel() {
        
        throw new Error ("Cancel method has to be used!");
    };

};

module.exports = State;
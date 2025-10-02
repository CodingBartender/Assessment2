class Command {

    async Execute() {
        throw new Error ('Execute() method must be used!')
    };

    async Undo() {
        throw new Error ('Undo() method must be used!')
    };

};

module.exports = Command;

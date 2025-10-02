class Command {

    async Execute() {
        throw new error('Execute() method must be used!')
    };

    async Undo() {
        throw new error('Undo() method must be used!')
    };

};

module.exports = Command;

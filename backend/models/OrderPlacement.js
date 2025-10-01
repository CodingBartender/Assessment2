const mongoose = require('mongoose');

const orderPlacement = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stockName: { type: String, required: true },
    price: { type: String, required: true },
    quantity: { type: Number, required: true }

});

module.exports = mongoose.model('OrderPlacement', taskSchema);
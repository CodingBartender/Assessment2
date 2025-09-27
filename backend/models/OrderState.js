const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
 
  userRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  stockName: { type: String, required: true, uppercase: true },

  // Number of shares(must be > 0)
  shares: { type: Number, required: true, min: 1 },

  unitPrice: { type: Number, required: true },
  
  type: { type: String, enum: ['Buy', 'Sell'], required: true },

  status: {
    type: String,
    enum: ['New', 'Pending', 'Executed', 'Cancelled'],
    default: 'New'
  },

  executedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

const mongoose = require('mongoose');


const portfolioSchema = new mongoose.Schema({
  buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // FK → Users
  virtual_balance: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
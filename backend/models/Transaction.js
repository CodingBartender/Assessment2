// ------------------ Transactions ------------------
const transactionSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },       // FK → Orders
  buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },        // FK → Users
  portfolio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio', required: true }, // FK → Portfolios
  stock_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },       // FK → Stocks
  transaction_type: { type: String, enum: ['BUY', 'SELL'], required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  executed_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema);
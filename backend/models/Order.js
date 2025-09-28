// ------------------ Orders ------------------
const orderSchema = new mongoose.Schema({
  buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },       // FK → Users
  portfolio_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio', required: true }, // FK → Portfolios
  stock_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },       // FK → Stocks
  order_type: { type: String, enum: ['BUY', 'SELL'], required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Executed', 'Cancelled'], default: 'Pending' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
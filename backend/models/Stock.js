const stockSchema = new mongoose.Schema({
  trader_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // FK → Users
  symbol: { type: String, unique: true, required: true },
  logo: { type: String },
  company_name: { type: String, required: true },
  current_price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  last_updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Stock', stockSchema);

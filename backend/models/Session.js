// ------------------ Sessions ------------------
const sessionSchema = new mongoose.Schema({
  controlled_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // FK → Users
  status: { type: String, enum: ['Active', 'Paused', 'Reset'], default: 'Active' },
  started_at: { type: Date, default: Date.now },
  ended_at: { type: Date }
});

module.exports = mongoose.model('Session', sessionSchema);

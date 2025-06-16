const mongoose = require('mongoose');
const goalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  frequency: { type: String, enum: ['daily', 'weekly'] },
  startDate: Date,
  endDate: Date,
});
module.exports = mongoose.model('Goal', goalSchema);
const mongoose = require('mongoose');
const habitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  goal: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal' },
  date: Date,
  status: { type: Boolean, default: false },
});
module.exports = mongoose.model('Habit', habitSchema);
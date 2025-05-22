const mongoose = require('mongoose');

const streakSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: Date, required: true },
  solved: { type: Boolean, default: false }, 
});

module.exports = mongoose.model('Streaks', streakSchema);
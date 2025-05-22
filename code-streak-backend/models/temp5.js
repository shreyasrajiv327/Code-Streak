// backend/models/DailyChallenge.js
const mongoose = require('mongoose');

const dailyChallengeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
  date: { type: Date, required: true },
  solved: { type: Boolean, default: false },
});

module.exports = mongoose.model('DailyChallenge', dailyChallengeSchema);
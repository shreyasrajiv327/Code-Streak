const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Bookmark', bookmarkSchema);

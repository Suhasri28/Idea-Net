const mongoose = require('mongoose');

const IdeaSchema = new mongoose.Schema({
  title: String,
  description: String,
  fundingGoal: Number,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Idea', IdeaSchema);

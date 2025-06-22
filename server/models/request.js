const mongoose = require('mongoose');
const RequestSchema = new mongoose.Schema({
  idea: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea' },
  investor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resumePath: String,
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
});
module.exports = mongoose.model('Request', RequestSchema);

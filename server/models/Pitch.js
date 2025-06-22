const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  github: String,
  resumePath: String,
});

const PitchSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  description: String,
  documentPath: String,
  requests: [RequestSchema],
});

module.exports = mongoose.model("Pitch", PitchSchema);
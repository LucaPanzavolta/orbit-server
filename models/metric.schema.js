const mongoose = require('mongoose');

const Metric = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  label: { type: String, required: true },
  score: { type: Number, min: 0, max: 100, required: true },
});

module.exports = Metric;
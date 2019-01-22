const mongoose = require('mongoose');

const Metric = require('./metric.schema')

const Snapshot = new mongoose.Schema({
  date: Date,
  comments: [String],
  metrics: [Metric]
});

module.exports = Snapshot;
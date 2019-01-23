const mongoose = require('mongoose');

const Metric = require('./metric.schema')

const Snapshot = new mongoose.Schema({
  date: Date,
  comments: [String],
  label: String, //changed
  score: Number  //changed
});

module.exports = Snapshot;
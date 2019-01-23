const mongoose = require('mongoose');

const Metric = require('./metric.schema')

const Snapshot = new mongoose.Schema({
  date: Date,
  comments: [String],
<<<<<<< HEAD
  label: String, //changed
  score: Number  //changed
=======
  metrics: [Metric]
>>>>>>> 1a5ea853c12c310ca02a8e50a1de8a488395bb54
});

module.exports = Snapshot;
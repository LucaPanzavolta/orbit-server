const mongoose = require('mongoose');

const Skill = require('./skill.model')

const Snapshot = new mongoose.Schema({
  date: Date,
  comments: [String],
  metrics: Array
});

module.exports = Snapshot;
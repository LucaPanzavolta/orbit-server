const mongoose = require('mongoose');

const Skill = require('./skill.model')

const Snapshot = new mongoose.Schema({
  date: Date,
  comments: [String],
  label: String, //changed
  score: Number  //changed
});

module.exports = Snapshot;
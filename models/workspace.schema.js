const mongoose = require('mongoose');


const Workspace = new mongoose.Schema({
  name: String,
  template: Object,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  entries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Entry'
  }],
  metricLabels: [String]
<<<<<<< HEAD

=======
  
>>>>>>> 1a5ea853c12c310ca02a8e50a1de8a488395bb54
});

module.exports = Workspace;
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['EMO-FACIAL', 'EMO-VOICE', 'EMO-WRITING', 'EMO-EEG', 'EMO-TEXT'],
    required: true,
  },
  version: {
    type: String,
    default: 'v1',
  },
  file: {
    type: [String],
  },
  output: {
    type: String,
    default: 'DRAFT', 
  },
});

module.exports = mongoose.model('Task', taskSchema);

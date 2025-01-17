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

// taskSchema.post('save', async function (doc) {
//   const jobId = doc.jobId;

//   // Only update job output if all tasks are finalized (no DRAFT/PENDING)
//   await checkAllTasksAndUpdateJob(jobId);
// });

// taskSchema.post('update', async function (doc) {
//   // Check if all tasks are completed before updating the job output
//   await checkAllTasksAndUpdateJob(doc.jobId);
// });

module.exports = mongoose.model('Task', taskSchema);

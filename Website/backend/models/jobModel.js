const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: 'User',
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
      unique: true, 
    },
    name: {
      type: String,
      default: () => new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14),
    },
    type: {
      type: String,
      enum: ['EMOTION-DETECTION'],
      required: true,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PENDING', 'COMPLETE'],
      default: 'DRAFT',
    },
    output: {
      type: [String], 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);

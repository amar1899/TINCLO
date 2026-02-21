import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applied: {
    type: Boolean,
    default: false
  },
  matchedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure a user can't match the same job twice
matchSchema.index({ userId: 1, jobId: 1 }, { unique: true });

export default mongoose.model('Match', matchSchema);

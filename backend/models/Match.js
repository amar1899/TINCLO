import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
    // Note: userId references User.userId (String), not User._id (ObjectId)
    // This maintains compatibility with existing data
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
  applicationStatus: {
    type: String,
    enum: ['pending', 'selected', 'rejected'],
    default: 'pending'
  },
  statusUpdatedAt: {
    type: Date
  },
  matchedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure a user can't match the same job twice
matchSchema.index({ userId: 1, jobId: 1 }, { unique: true });

export default mongoose.model('Match', matchSchema);

import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  salary: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  source: {
    type: String,
    enum: ['Naukri', 'LinkedIn', 'Indeed', 'Glassdoor', 'Direct'],
    default: 'Naukri'
  },
  applyUrl: {
    type: String,
    default: null
  },
  tags: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Job', jobSchema);

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    trim: true,
    default: ''
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: ''
  },
  password: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', userSchema);

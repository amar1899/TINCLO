import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  name:   { type: String, trim: true, default: '' },
  email:  { type: String, trim: true, lowercase: true, default: '', index: true },
  password: { type: String, default: '' },
  phone:    { type: String, default: '' },
  location: { type: String, default: '' },
  bio:      { type: String, default: '' },
  role:     { type: String, enum: ['user', 'admin', 'recruiter'], default: 'user' },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('User', userSchema);

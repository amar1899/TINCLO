// Usage: node insertUser.js
import mongoose from 'mongoose';
import User from './models/User.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/your-db-name'; // Update if needed

const NEW_USER = {
  userId: 'vadlamudibrahmaiah02',
  name: 'Test User',
  email: 'vadlamudibrahmaiah02@gmail.com',
  password: 'password123', // Change this after first login for security
};

async function main() {
  await mongoose.connect(MONGO_URI);
  const existing = await User.findOne({ email: NEW_USER.email.toLowerCase().trim() });
  if (existing) {
    console.log('User already exists:', existing);
  } else {
    const user = new User(NEW_USER);
    await user.save();
    console.log('User inserted:', NEW_USER.email);
  }
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

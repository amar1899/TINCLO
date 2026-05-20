// Usage: node checkUser.js
import mongoose from 'mongoose';
import User from './models/User.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/your-db-name'; // Update if needed
const EMAIL_TO_CHECK = 'vadlamudibrahmaiah02@gmail.com';

async function main() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const user = await User.findOne({ email: EMAIL_TO_CHECK.toLowerCase().trim() });
  if (user) {
    console.log('User found:', user);
  } else {
    console.log('User NOT found with email:', EMAIL_TO_CHECK);
  }
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

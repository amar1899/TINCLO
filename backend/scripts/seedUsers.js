import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const sampleUsers = [
  { userId: 'john-doe-123' },
  { userId: 'jane-smith-456' },
  { userId: 'mike-wilson-789' },
  { userId: 'sarah-johnson-101' },
  { userId: 'test-user-001' },
  { userId: 'demo-user-002' },
  { userId: 'amar-user-003' }
];

async function seedUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing users (optional - comment out if you want to keep existing users)
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Insert sample users
    const insertedUsers = await User.insertMany(sampleUsers);
    console.log(`✅ Successfully inserted ${insertedUsers.length} users:`);
    insertedUsers.forEach(user => {
      console.log(`   - ${user.userId} (ID: ${user._id})`);
    });

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
    process.exit(1);
  }
}

seedUsers();

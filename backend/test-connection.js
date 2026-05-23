import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing MongoDB connection...');
console.log('Connection string:', process.env.MONGODB_URI?.replace(/:[^:@]+@/, ':****@'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB Atlas!');
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Connection failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Error name:', error.name);
    process.exit(1);
  });

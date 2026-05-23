/**
 * Bug Condition Exploration Test
 * Property 1: Fault Condition - Match Creation Without User Validation
 * 
 * This test demonstrates the bug: matches can be created with non-existent userIds
 * because there's no User model to validate against.
 * 
 * EXPECTED OUTCOME ON UNFIXED CODE: Test will show matches being created
 * with invalid userIds, confirming lack of validation.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Match from './models/Match.js';
import Job from './models/Job.js';

dotenv.config();

async function testBugCondition() {
  console.log('🧪 Bug Condition Exploration Test');
  console.log('Property 1: Fault Condition - Match Creation Without User Validation\n');

  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get a valid job from the database
    let job = await Job.findOne();
    if (!job) {
      console.log('⚠️  No jobs found in database. Creating a test job...');
      const testJob = new Job({
        title: 'Test Job',
        company: 'Test Company',
        location: 'Test Location',
        description: 'Test Description',
        salary: '$50,000',
        type: 'Full-time'
      });
      job = await testJob.save();
      console.log('✅ Test job created\n');
    }

    const validJobId = job._id;

    // Test Case 1: Attempt to create match with non-existent userId
    console.log('Test Case 1: Create match with non-existent userId "fake-user-999"');
    const fakeUserId = 'fake-user-999';
    
    const match = new Match({
      userId: fakeUserId,
      jobId: validJobId,
      applied: false
    });

    try {
      const savedMatch = await match.save();
      console.log('❌ BUG CONFIRMED: Match saved with non-existent userId!');
      console.log('   Match ID:', savedMatch._id);
      console.log('   User ID:', savedMatch.userId);
      console.log('   This proves there is no user validation\n');
      
      // Clean up
      await Match.deleteOne({ _id: savedMatch._id });
    } catch (error) {
      console.log('✅ GOOD: Match creation failed (user validation exists)');
      console.log('   Error:', error.message);
      console.log('   This means the fix is already in place\n');
    }

    // Test Case 2: Verify no User model exists
    console.log('Test Case 2: Check if User model exists');
    try {
      const User = mongoose.model('User');
      console.log('✅ User model exists');
      console.log('   This means the fix is already in place\n');
    } catch (error) {
      console.log('❌ BUG CONFIRMED: No User model exists!');
      console.log('   Error:', error.message);
      console.log('   This proves the bug condition\n');
    }

    console.log('📊 Summary:');
    console.log('The bug condition is: Match model accepts any userId string');
    console.log('without validating that the user actually exists.');
    console.log('\nExpected behavior after fix:');
    console.log('- User model should exist in backend/models/User.js');
    console.log('- Match creation should validate user exists first');
    console.log('- Match should only save when user reference is valid');
    console.log('- userId should be ObjectId reference, not String');

  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  }
}

testBugCondition();

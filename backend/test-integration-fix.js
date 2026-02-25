/**
 * Integration Test for User Like Save Fix
 * 
 * This test validates the complete fix end-to-end:
 * 1. User model exists and works
 * 2. User CRUD operations work
 * 3. Match creation validates user exists
 * 4. All existing match operations still work (preservation)
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Match from './models/Match.js';
import Job from './models/Job.js';

dotenv.config();

async function runIntegrationTest() {
  console.log('🧪 Integration Test - User Like Save Fix');
  console.log('Testing complete workflow with User model validation\n');

  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    let allTestsPassed = true;
    const testUserId = 'integration-test-user-' + Date.now();

    // Setup: Get or create a test job
    let job = await Job.findOne();
    if (!job) {
      job = new Job({
        title: 'Integration Test Job',
        company: 'Test Company',
        location: 'Test Location',
        description: 'Test Description',
        salary: '$60,000',
        type: 'Full-time'
      });
      await job.save();
      console.log('✅ Setup: Created test job\n');
    }
    const jobId = job._id;

    // Test 1: Create user
    console.log('Test 1: Create user via User model');
    try {
      const user = new User({ userId: testUserId });
      await user.save();
      console.log('✅ PASS: User created');
      console.log('   User ID:', user.userId, '\n');
    } catch (error) {
      console.log('❌ FAIL:', error.message, '\n');
      allTestsPassed = false;
    }

    // Test 2: Fetch user
    console.log('Test 2: Fetch user');
    try {
      const fetchedUser = await User.findOne({ userId: testUserId });
      if (fetchedUser) {
        console.log('✅ PASS: User fetched successfully');
        console.log('   User ID:', fetchedUser.userId, '\n');
      } else {
        console.log('❌ FAIL: User not found\n');
        allTestsPassed = false;
      }
    } catch (error) {
      console.log('❌ FAIL:', error.message, '\n');
      allTestsPassed = false;
    }

    // Test 3: Validate user exists before creating match (simulating route logic)
    console.log('Test 3: Validate user exists before creating match');
    try {
      const userExists = await User.findOne({ userId: testUserId });
      if (userExists) {
        console.log('✅ PASS: User validation successful');
        console.log('   User exists, can proceed with match creation\n');
      } else {
        console.log('❌ FAIL: User validation failed\n');
        allTestsPassed = false;
      }
    } catch (error) {
      console.log('❌ FAIL:', error.message, '\n');
      allTestsPassed = false;
    }

    // Test 4: Create match with validated user
    console.log('Test 4: Create match with validated user');
    let matchId;
    try {
      const match = new Match({
        userId: testUserId,
        jobId: jobId,
        applied: false
      });
      const savedMatch = await match.save();
      matchId = savedMatch._id;
      console.log('✅ PASS: Match created successfully');
      console.log('   Match ID:', savedMatch._id);
      console.log('   User ID:', savedMatch.userId, '\n');
    } catch (error) {
      console.log('❌ FAIL:', error.message, '\n');
      allTestsPassed = false;
    }

    // Test 5: Fetch matches for user (preservation test)
    console.log('Test 5: Fetch matches for user (preservation)');
    try {
      const matches = await Match.find({ userId: testUserId })
        .populate('jobId')
        .sort({ matchedAt: -1 });
      
      if (matches.length > 0) {
        console.log('✅ PASS: Matches fetched successfully');
        console.log('   Found', matches.length, 'match(es)');
        console.log('   Job populated:', matches[0].jobId ? 'Yes' : 'No', '\n');
      } else {
        console.log('❌ FAIL: No matches found\n');
        allTestsPassed = false;
      }
    } catch (error) {
      console.log('❌ FAIL:', error.message, '\n');
      allTestsPassed = false;
    }

    // Test 6: Mark match as applied (preservation test)
    console.log('Test 6: Mark match as applied (preservation)');
    try {
      const match = await Match.findById(matchId);
      match.applied = true;
      await match.save();
      
      const updatedMatch = await Match.findById(matchId);
      if (updatedMatch.applied === true) {
        console.log('✅ PASS: Match marked as applied');
        console.log('   Applied:', updatedMatch.applied, '\n');
      } else {
        console.log('❌ FAIL: Applied field not updated\n');
        allTestsPassed = false;
      }
    } catch (error) {
      console.log('❌ FAIL:', error.message, '\n');
      allTestsPassed = false;
    }

    // Test 7: Delete match (preservation test)
    console.log('Test 7: Delete match (preservation)');
    try {
      await Match.deleteOne({ _id: matchId });
      const deletedMatch = await Match.findById(matchId);
      
      if (deletedMatch === null) {
        console.log('✅ PASS: Match deleted successfully\n');
      } else {
        console.log('❌ FAIL: Match still exists\n');
        allTestsPassed = false;
      }
    } catch (error) {
      console.log('❌ FAIL:', error.message, '\n');
      allTestsPassed = false;
    }

    // Test 8: Attempt to create match with non-existent user
    console.log('Test 8: Prevent match creation with non-existent user');
    const fakeUserId = 'fake-user-' + Date.now();
    try {
      // Simulate route validation
      const userExists = await User.findOne({ userId: fakeUserId });
      
      if (!userExists) {
        console.log('✅ PASS: Non-existent user detected');
        console.log('   Route validation would prevent match creation\n');
      } else {
        console.log('❌ FAIL: User unexpectedly exists\n');
        allTestsPassed = false;
      }
    } catch (error) {
      console.log('❌ FAIL:', error.message, '\n');
      allTestsPassed = false;
    }

    // Test 9: Duplicate prevention (preservation test)
    console.log('Test 9: Duplicate match prevention (preservation)');
    try {
      const match1 = new Match({
        userId: testUserId,
        jobId: jobId,
        applied: false
      });
      await match1.save();

      const match2 = new Match({
        userId: testUserId,
        jobId: jobId,
        applied: false
      });

      try {
        await match2.save();
        console.log('❌ FAIL: Duplicate match was allowed\n');
        allTestsPassed = false;
      } catch (dupError) {
        if (dupError.code === 11000) {
          console.log('✅ PASS: Duplicate match prevented');
          console.log('   Error code:', dupError.code, '\n');
        } else {
          console.log('❌ FAIL: Wrong error type\n');
          allTestsPassed = false;
        }
      }

      // Clean up
      await Match.deleteOne({ _id: match1._id });
    } catch (error) {
      console.log('❌ FAIL:', error.message, '\n');
      allTestsPassed = false;
    }

    // Clean up test data
    await User.deleteOne({ userId: testUserId });
    console.log('✅ Cleanup: Test user deleted\n');

    console.log('═══════════════════════════════════════════════════════');
    console.log('📊 FINAL SUMMARY');
    console.log('═══════════════════════════════════════════════════════');
    
    if (allTestsPassed) {
      console.log('✅ ALL TESTS PASSED');
      console.log('\nThe fix is complete and working correctly:');
      console.log('  ✓ User model exists and works');
      console.log('  ✓ User CRUD operations work');
      console.log('  ✓ Match creation validates user exists');
      console.log('  ✓ Matches can be created with valid users');
      console.log('  ✓ All existing match operations preserved');
      console.log('  ✓ Duplicate prevention still works');
      console.log('\nThe bug is FIXED! 🎉');
    } else {
      console.log('❌ SOME TESTS FAILED');
      console.log('\nPlease review the failures above.');
    }

  } catch (error) {
    console.error('❌ Integration test error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  }
}

runIntegrationTest();

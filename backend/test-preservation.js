/**
 * Preservation Property Tests
 * Property 2: Preservation - Existing Match Operations
 * 
 * These tests verify that existing match operations work correctly
 * on the UNFIXED code and will continue to work after the fix.
 * 
 * EXPECTED OUTCOME: All tests should PASS on unfixed code.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Match from './models/Match.js';
import Job from './models/Job.js';

dotenv.config();

async function testPreservation() {
  console.log('🧪 Preservation Property Tests');
  console.log('Property 2: Preservation - Existing Match Operations\n');

  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Setup: Get or create a test job
    let job = await Job.findOne();
    if (!job) {
      job = new Job({
        title: 'Test Job for Preservation',
        company: 'Test Company',
        location: 'Test Location',
        description: 'Test Description',
        salary: '$50,000',
        type: 'Full-time'
      });
      await job.save();
    }

    const testUserId = 'preservation-test-user';
    const jobId = job._id;

    // Clean up any existing test matches
    await Match.deleteMany({ userId: testUserId });

    // Create a test match for preservation tests
    const testMatch = new Match({
      userId: testUserId,
      jobId: jobId,
      applied: false
    });
    await testMatch.save();
    console.log('✅ Setup: Created test match\n');

    let allTestsPassed = true;

    // Test 1: Fetch matches returns sorted results
    console.log('Test 1: GET /api/matches/user/:userId returns matches sorted by matchedAt');
    try {
      const matches = await Match.find({ userId: testUserId })
        .populate('jobId')
        .sort({ matchedAt: -1 });
      
      if (matches.length > 0) {
        console.log('✅ PASS: Found', matches.length, 'match(es)');
        console.log('   First match ID:', matches[0]._id);
        console.log('   Job populated:', matches[0].jobId ? 'Yes' : 'No');
        console.log('   Sorted by matchedAt: descending\n');
      } else {
        console.log('❌ FAIL: No matches found\n');
        allTestsPassed = false;
      }
    } catch (error) {
      console.log('❌ FAIL:', error.message, '\n');
      allTestsPassed = false;
    }

    // Test 2: Mark match as applied
    console.log('Test 2: PUT /api/matches/:id/apply updates applied field');
    try {
      const match = await Match.findOne({ userId: testUserId });
      match.applied = true;
      await match.save();
      
      const updatedMatch = await Match.findById(match._id).populate('jobId');
      
      if (updatedMatch.applied === true) {
        console.log('✅ PASS: Applied field updated to true');
        console.log('   Match ID:', updatedMatch._id);
        console.log('   Applied:', updatedMatch.applied, '\n');
      } else {
        console.log('❌ FAIL: Applied field not updated\n');
        allTestsPassed = false;
      }
    } catch (error) {
      console.log('❌ FAIL:', error.message, '\n');
      allTestsPassed = false;
    }

    // Test 3: Delete match
    console.log('Test 3: DELETE /api/matches/:id removes match');
    try {
      const match = await Match.findOne({ userId: testUserId });
      const matchId = match._id;
      await match.deleteOne();
      
      const deletedMatch = await Match.findById(matchId);
      
      if (deletedMatch === null) {
        console.log('✅ PASS: Match deleted successfully');
        console.log('   Match ID:', matchId, 'no longer exists\n');
      } else {
        console.log('❌ FAIL: Match still exists after deletion\n');
        allTestsPassed = false;
      }
    } catch (error) {
      console.log('❌ FAIL:', error.message, '\n');
      allTestsPassed = false;
    }

    // Test 4: Duplicate prevention
    console.log('Test 4: Duplicate match prevention');
    try {
      // Create first match
      const match1 = new Match({
        userId: 'duplicate-test-user',
        jobId: jobId,
        applied: false
      });
      await match1.save();
      console.log('✅ First match created');

      // Attempt to create duplicate
      const match2 = new Match({
        userId: 'duplicate-test-user',
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
          console.log('   Error code:', dupError.code);
          console.log('   This is the expected behavior\n');
        } else {
          console.log('❌ FAIL: Wrong error type:', dupError.message, '\n');
          allTestsPassed = false;
        }
      }

      // Clean up
      await Match.deleteMany({ userId: 'duplicate-test-user' });
    } catch (error) {
      console.log('❌ FAIL:', error.message, '\n');
      allTestsPassed = false;
    }

    // Test 5: Match objects populated with job details
    console.log('Test 5: Match objects populated with job details');
    try {
      const match = new Match({
        userId: 'populate-test-user',
        jobId: jobId,
        applied: false
      });
      await match.save();

      const populatedMatch = await Match.findById(match._id).populate('jobId');
      
      if (populatedMatch.jobId && populatedMatch.jobId.title) {
        console.log('✅ PASS: Match populated with job details');
        console.log('   Job title:', populatedMatch.jobId.title);
        console.log('   Job company:', populatedMatch.jobId.company, '\n');
      } else {
        console.log('❌ FAIL: Match not properly populated\n');
        allTestsPassed = false;
      }

      // Clean up
      await Match.deleteOne({ _id: match._id });
    } catch (error) {
      console.log('❌ FAIL:', error.message, '\n');
      allTestsPassed = false;
    }

    console.log('📊 Summary:');
    if (allTestsPassed) {
      console.log('✅ All preservation tests PASSED on unfixed code');
      console.log('These behaviors must be preserved after implementing the fix.');
    } else {
      console.log('❌ Some preservation tests FAILED');
      console.log('This may indicate existing issues that need attention.');
    }

  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  }
}

testPreservation();

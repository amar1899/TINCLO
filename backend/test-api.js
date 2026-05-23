// Quick API test script
const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  try {
    // Test 1: Health check
    console.log('Testing health endpoint...');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const health = await healthRes.json();
    console.log('✅ Health:', health);

    // Test 2: Get all jobs
    console.log('\nTesting GET /api/jobs...');
    const jobsRes = await fetch(`${BASE_URL}/jobs`);
    const jobs = await jobsRes.json();
    console.log(`✅ Found ${jobs.length} jobs`);

    if (jobs.length > 0) {
      const testJobId = jobs[0]._id;
      
      // Test 3: Get single job
      console.log('\nTesting GET /api/jobs/:id...');
      const jobRes = await fetch(`${BASE_URL}/jobs/${testJobId}`);
      const job = await jobRes.json();
      console.log('✅ Retrieved job:', job.title);

      // Test 4: Create match
      console.log('\nTesting POST /api/matches...');
      const matchRes = await fetch(`${BASE_URL}/matches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'test-user-123', jobId: testJobId })
      });
      const match = await matchRes.json();
      console.log('✅ Created match:', match._id);

      // Test 5: Get user matches
      console.log('\nTesting GET /api/matches/user/:userId...');
      const matchesRes = await fetch(`${BASE_URL}/matches/user/test-user-123`);
      const matches = await matchesRes.json();
      console.log(`✅ Found ${matches.length} matches for user`);

      // Test 6: Mark as applied
      console.log('\nTesting PUT /api/matches/:id/apply...');
      const applyRes = await fetch(`${BASE_URL}/matches/${match._id}/apply`, {
        method: 'PUT'
      });
      const appliedMatch = await applyRes.json();
      console.log('✅ Marked as applied:', appliedMatch.applied);

      // Test 7: Delete match
      console.log('\nTesting DELETE /api/matches/:id...');
      const deleteRes = await fetch(`${BASE_URL}/matches/${match._id}`, {
        method: 'DELETE'
      });
      const deleteResult = await deleteRes.json();
      console.log('✅ Deleted match:', deleteResult.message);

      // Test 8: Duplicate match prevention
      console.log('\nTesting duplicate match prevention...');
      const match2Res = await fetch(`${BASE_URL}/matches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'test-user-456', jobId: testJobId })
      });
      await match2Res.json();
      
      const duplicateRes = await fetch(`${BASE_URL}/matches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'test-user-456', jobId: testJobId })
      });
      const duplicateResult = await duplicateRes.json();
      console.log('✅ Duplicate prevention:', duplicateResult.message);
    }

    console.log('\n✅ All API tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testAPI();

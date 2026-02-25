# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Fault Condition** - Match Creation Fails Without User Model
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to concrete failing cases - attempting to create a match with a userId when no User model exists
  - Test that POST /api/matches with userId "test-user-123" and valid jobId fails on unfixed code
  - Test that the error relates to missing User model or validation failure
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found to understand root cause
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.1, 2.2_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Existing Match Operations
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for existing match operations (fetch, apply, delete)
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements
  - Test GET /api/matches/user/:userId returns matches sorted by matchedAt descending
  - Test PUT /api/matches/:id/apply updates applied field correctly
  - Test DELETE /api/matches/:id removes match successfully
  - Test duplicate prevention (same user cannot like same job twice)
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 3. Fix for User Like Save

  - [x] 3.1 Create User model
    - Create backend/models/User.js with minimal schema
    - Add userId field (String, unique, required, indexed)
    - Add createdAt field (Date, default: Date.now)
    - Export Mongoose model
    - _Bug_Condition: isBugCondition(input) where User.exists(input.userId) returns FALSE_
    - _Expected_Behavior: User model exists to validate userId references_
    - _Preservation: Does not affect existing match operations_
    - _Requirements: 2.1, 2.2_

  - [x] 3.2 Create user CRUD routes
    - Create backend/routes/users.js
    - Implement POST /api/users to create new user (accept userId in body)
    - Implement GET /api/users/:userId to fetch user by userId
    - Handle duplicate userId errors with appropriate status codes
    - _Bug_Condition: No user CRUD operations exist_
    - _Expected_Behavior: Users can be created and fetched via API_
    - _Preservation: Does not affect existing match operations_
    - _Requirements: 2.1, 2.2_

  - [x] 3.3 Update Match model to reference User
    - Update backend/models/Match.js
    - Change userId field type from String to mongoose.Schema.Types.ObjectId
    - Add ref: 'User' to enable population
    - Keep required: true and index: true
    - _Bug_Condition: Match model does not properly reference User model_
    - _Expected_Behavior: Match model references User model correctly_
    - _Preservation: Existing match queries continue to work_
    - _Requirements: 2.1, 2.3_

  - [x] 3.4 Add user validation in match creation
    - Update backend/routes/matches.js
    - Import User model
    - Before creating match, validate user exists with User.findOne({ userId })
    - Return 400 error if user not found
    - Proceed with match creation if user exists
    - _Bug_Condition: No validation that user exists before creating match_
    - _Expected_Behavior: Match creation validates user exists first_
    - _Preservation: Does not affect other match operations_
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.5 Register user routes in server
    - Update backend/resolve-srv.js or backend/server.js
    - Import user routes from routes/users.js
    - Register routes with app.use('/api/users', userRoutes)
    - _Bug_Condition: User routes not accessible_
    - _Expected_Behavior: User routes are registered and accessible_
    - _Preservation: Does not affect existing routes_
    - _Requirements: 2.1, 2.2_

  - [x] 3.6 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Match Creation Succeeds With User Model
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.7 Verify preservation tests still pass
    - **Property 2: Preservation** - Existing Match Operations Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

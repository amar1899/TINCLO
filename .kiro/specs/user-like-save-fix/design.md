# User Like Save Fix - Bugfix Design

## Overview

The application fails to save likes because the Match model references a userId field, but there is no User model in the backend to validate these references. This causes database validation errors when attempting to create matches. The fix involves creating a minimal User model with basic CRUD operations to support the existing Match functionality.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when a user attempts to like a job but the Match model cannot validate the userId reference
- **Property (P)**: The desired behavior when a user likes a job - the match should be saved successfully with a valid user reference
- **Preservation**: Existing match operations (fetch, apply, delete, duplicate prevention) that must remain unchanged by the fix
- **Match.save()**: The Mongoose operation in `backend/routes/matches.js` that attempts to persist a match to the database
- **userId**: A string identifier passed from the frontend that needs to reference a valid User document

## Bug Details

### Fault Condition

The bug manifests when a user clicks the like button on a job. The Match model attempts to save a document with a userId field, but since there is no User model to validate against, the database operation fails with a validation or reference error.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type { userId: string, jobId: string }
  OUTPUT: boolean
  
  RETURN input.userId IS NOT NULL
         AND input.jobId IS VALID
         AND User.exists(input.userId) RETURNS FALSE
         AND Match.save() FAILS
END FUNCTION
```

### Examples

- User clicks like on "Senior Frontend Developer" job → Error: "unable to save job please try again"
- User clicks like on "UX/UI Designer" job → Error: "unable to save job please try again"
- User attempts to migrate local matches to database → All match creations fail
- Edge case: Even with valid jobId, match creation fails due to missing User model

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- Fetching user matches must continue to return all matches sorted by matchedAt in descending order
- Marking a match as applied must continue to update the applied field correctly
- Deleting a match must continue to remove it from the database successfully
- Duplicate match prevention must continue to work (same user cannot like same job twice)
- Match objects must continue to be populated with job details when returned

**Scope:**
All match operations that do NOT involve initial match creation should be completely unaffected by this fix. This includes:
- GET /api/matches/user/:userId (fetch matches)
- PUT /api/matches/:id/apply (mark as applied)
- DELETE /api/matches/:id (delete match)
- Duplicate detection via unique index on (userId, jobId)

## Hypothesized Root Cause

Based on the bug description and code analysis, the root cause is:

1. **Missing User Model**: The Match schema references userId as a String, but there is no User model in the backend
   - Match model at `backend/models/Match.js` has userId field
   - No corresponding `backend/models/User.js` exists
   - No user routes or CRUD operations exist

2. **No User Validation**: Without a User model, the system cannot validate that userId references exist
   - Frontend passes userId (e.g., "test-user-123") to POST /api/matches
   - Backend has no way to verify this user exists
   - Database may reject the operation or create orphaned references

3. **Missing User CRUD Operations**: No API endpoints exist to create or manage users
   - No POST /api/users endpoint to create users
   - No way to ensure a user exists before creating matches

## Correctness Properties

Property 1: Fault Condition - Match Creation with Valid User Reference

_For any_ input where a user attempts to like a job (userId and jobId are provided), the fixed system SHALL successfully save the match to the database after validating that the userId references an existing User document, returning the populated match object with job details.

**Validates: Requirements 2.1, 2.2, 2.3**

Property 2: Preservation - Existing Match Operations

_For any_ match operation that is NOT initial match creation (fetching matches, marking as applied, deleting matches, duplicate prevention), the fixed code SHALL produce exactly the same behavior as the original code, preserving all existing functionality for these operations.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

## Fix Implementation

### Changes Required

**File 1**: `backend/models/User.js` (NEW)

**Purpose**: Create a minimal User model to support match creation

**Specific Changes**:
1. **Create User Schema**: Define a Mongoose schema with minimal fields
   - userId: String (unique identifier, indexed, required)
   - createdAt: Date (timestamp for record keeping)

2. **Add Validation**: Ensure userId is unique and required

3. **Export Model**: Export as Mongoose model for use in routes

**File 2**: `backend/routes/users.js` (NEW)

**Purpose**: Provide CRUD operations for users

**Specific Changes**:
1. **POST /api/users**: Create a new user
   - Accept userId in request body
   - Return created user document
   - Handle duplicate userId errors

2. **GET /api/users/:userId**: Fetch a user by userId
   - Return user document if found
   - Return 404 if not found

**File 3**: `backend/server.js` or `backend/resolve-srv.js`

**Purpose**: Register user routes with Express app

**Specific Changes**:
1. **Import User Routes**: Add import for users.js
2. **Register Routes**: Add app.use('/api/users', userRoutes)

**File 4**: `backend/models/Match.js`

**Purpose**: Update Match model to properly reference User model

**Specific Changes**:
1. **Update userId Field**: Change from String to ObjectId reference
   - Change type from String to mongoose.Schema.Types.ObjectId
   - Add ref: 'User' to enable population
   - Keep required: true and index: true

**File 5**: `backend/routes/matches.js`

**Purpose**: Add user existence validation before creating matches

**Specific Changes**:
1. **Add User Import**: Import User model
2. **Validate User Exists**: Before creating match, verify user exists
   - Query User.findOne({ userId: req.body.userId })
   - Return 400 error if user not found
   - Proceed with match creation if user exists

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Fault Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Write tests that attempt to create matches with various userId values on the UNFIXED code. Observe the specific error messages and failure modes to confirm the root cause.

**Test Cases**:
1. **Basic Like Test**: Attempt to create match with userId "test-user-123" and valid jobId (will fail on unfixed code)
2. **Multiple Users Test**: Attempt to create matches for different userIds (will fail on unfixed code)
3. **Migration Test**: Attempt to migrate local matches to database (will fail on unfixed code)
4. **Edge Case - Invalid Job**: Attempt to create match with invalid jobId (should fail with different error)

**Expected Counterexamples**:
- Match creation fails with validation or reference errors
- Error message: "unable to save job please try again" or similar database error
- Possible causes: missing User model, no user validation, orphaned references

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  // Ensure user exists first
  user := createUser(input.userId)
  result := createMatch_fixed(input.userId, input.jobId)
  ASSERT result.success = true
  ASSERT result.match.userId = input.userId
  ASSERT result.match.jobId = input.jobId
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL operation WHERE operation != "createMatch" DO
  ASSERT operation_original(input) = operation_fixed(input)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for existing match operations, then write property-based tests capturing that behavior.

**Test Cases**:
1. **Fetch Matches Preservation**: Observe that GET /api/matches/user/:userId works correctly on unfixed code, then verify it continues after fix
2. **Mark Applied Preservation**: Observe that PUT /api/matches/:id/apply works correctly on unfixed code, then verify it continues after fix
3. **Delete Match Preservation**: Observe that DELETE /api/matches/:id works correctly on unfixed code, then verify it continues after fix
4. **Duplicate Prevention Preservation**: Observe that duplicate match attempts are rejected on unfixed code, then verify this continues after fix

### Unit Tests

- Test User model creation with valid userId
- Test User model validation (duplicate userId rejection)
- Test Match creation with existing user
- Test Match creation with non-existent user (should fail with 400)
- Test that existing match operations continue to work

### Property-Based Tests

- Generate random userIds and jobIds, verify matches can be created after users exist
- Generate random match operations (fetch, apply, delete), verify behavior is preserved
- Test that duplicate prevention works across many scenarios

### Integration Tests

- Test full flow: create user → create match → fetch matches → mark applied → delete match
- Test migration flow: create user → migrate multiple local matches
- Test error handling: attempt match creation without user → verify appropriate error

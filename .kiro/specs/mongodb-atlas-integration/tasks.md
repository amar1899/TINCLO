# Implementation Plan: MongoDB Atlas Integration

## Overview

This implementation plan converts the MongoDB Atlas integration design into actionable coding tasks. The implementation follows a phased approach: backend setup, frontend integration, data migration, and testing. Each task builds incrementally to ensure core functionality is validated early through code.

## Tasks

- [x] 1. Set up backend project structure and configuration
  - Create backend directory structure (models/, routes/, scripts/)
  - Create .env.example template with MONGODB_URI, PORT, and FRONTEND_URL placeholders
  - Install dependencies: express, mongoose, cors, dotenv
  - Create package.json with scripts for server and seed
  - _Requirements: 1.4, 1.5_

- [ ] 2. Implement database models
  - [x] 2.1 Create Job model with schema validation
    - Define Job schema with required fields: title, company, description, salary, location, createdAt
    - Add trimming for title and company fields
    - Export Job model
    - _Requirements: 3.1, 3.5_
  
  - [ ]* 2.2 Write property test for Job model
    - **Property 1: Job Document Schema Completeness**
    - **Validates: Requirements 3.1**
  
  - [x] 2.3 Create Match model with schema validation and indexes
    - Define Match schema with required fields: userId, jobId, applied, matchedAt
    - Add reference from jobId to Job model
    - Create compound unique index on (userId, jobId)
    - Create single field index on userId
    - Export Match model
    - _Requirements: 4.1, 4.4_
  
  - [ ]* 2.4 Write property test for Match model
    - **Property 5: Match Document Schema Completeness**
    - **Validates: Requirements 4.1**

- [x] 3. Implement database connection and server setup
  - [x] 3.1 Create server.js with Express app and MongoDB connection
    - Load environment variables with dotenv
    - Validate MONGODB_URI exists, exit with error if missing
    - Configure Express middleware (CORS with credentials, JSON parser)
    - Connect to MongoDB with mongoose using connection string
    - Start HTTP server only after successful database connection
    - Log connection success/failure with descriptive messages
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.5, 10.1, 10.2, 10.3, 10.4, 10.5_
  
  - [ ]* 3.2 Write unit tests for server startup and configuration
    - Test missing MONGODB_URI causes exit
    - Test CORS configuration with FRONTEND_URL
    - Test JSON body parser middleware
    - _Requirements: 1.3, 10.1, 10.5_

- [ ] 4. Implement job routes and handlers
  - [x] 4.1 Create GET /api/jobs endpoint
    - Implement route handler to retrieve all jobs
    - Sort results by createdAt descending
    - Return 200 with job array on success
    - Return 500 with error message on database error
    - _Requirements: 3.2, 9.1_
  
  - [ ]* 4.2 Write property test for job listing sort order
    - **Property 2: Job Listing Sort Order**
    - **Validates: Requirements 3.2**
  
  - [x] 4.3 Create GET /api/jobs/:id endpoint
    - Implement route handler to retrieve single job by ID
    - Return 200 with job document if found
    - Return 404 with "Job not found" if not found
    - Return 500 with error message on database error
    - _Requirements: 3.3, 3.4, 9.1_
  
  - [ ]* 4.4 Write property test for job retrieval round trip
    - **Property 3: Job Retrieval Round Trip**
    - **Validates: Requirements 3.3**
  
  - [x] 4.5 Create POST /api/jobs endpoint
    - Implement route handler to create new job
    - Validate required fields via Mongoose schema
    - Return 201 with created job on success
    - Return 400 with validation error message on missing fields
    - Return 500 with error message on database error
    - _Requirements: 3.1, 3.5, 9.1_
  
  - [ ]* 4.6 Write property test for job validation
    - **Property 4: Job Validation Rejects Incomplete Data**
    - **Validates: Requirements 3.5**
  
  - [x] 4.7 Create DELETE /api/jobs/:id endpoint
    - Implement route handler to delete job by ID
    - Return 200 with "Job deleted" message on success
    - Return 404 with "Job not found" if not found
    - Return 500 with error message on database error
    - _Requirements: 9.1_

- [x] 5. Checkpoint - Ensure job routes work correctly
  - Test all job endpoints with Postman or curl
  - Verify error responses return correct status codes
  - Ensure all tests pass, ask the user if questions arise

- [ ] 6. Implement match routes and handlers
  - [x] 6.1 Create GET /api/matches/user/:userId endpoint
    - Implement route handler to retrieve all matches for user
    - Populate jobId field with complete job document
    - Sort results by matchedAt descending
    - Return 200 with populated match array on success
    - Return 500 with error message on database error
    - _Requirements: 4.3, 9.1_
  
  - [ ]* 6.2 Write property test for user matches sort order
    - **Property 7: User Matches Sort Order**
    - **Validates: Requirements 4.3**
  
  - [x] 6.3 Create POST /api/matches endpoint
    - Implement route handler to create new match
    - Accept userId and jobId in request body
    - Catch duplicate error (MongoDB error code 11000)
    - Return 201 with populated match on success
    - Return 400 with "Already matched with this job" on duplicate
    - Return 400 with validation error on missing fields
    - Return 500 with error message on database error
    - _Requirements: 4.2, 4.4, 4.5, 9.1_
  
  - [ ]* 6.4 Write property test for match creation round trip
    - **Property 6: Match Creation Round Trip**
    - **Validates: Requirements 4.2**
  
  - [ ]* 6.5 Write property test for duplicate match prevention
    - **Property 8: Duplicate Match Prevention**
    - **Validates: Requirements 4.4**
  
  - [x] 6.6 Create PUT /api/matches/:id/apply endpoint
    - Implement route handler to mark match as applied
    - Find match by ID, set applied to true, save
    - Populate jobId field in response
    - Return 200 with populated updated match on success
    - Return 404 with "Match not found" if not found
    - Return 500 with error message on database error
    - _Requirements: 5.1, 5.2, 5.4, 9.1_
  
  - [ ]* 6.7 Write property test for match applied status update
    - **Property 9: Match Applied Status Update**
    - **Validates: Requirements 5.1**
  
  - [ ]* 6.8 Write property test for match timestamp invariant
    - **Property 11: Match Timestamp Invariant**
    - **Validates: Requirements 5.4**
  
  - [x] 6.9 Create DELETE /api/matches/:id endpoint
    - Implement route handler to delete match by ID
    - Return 200 with "Match deleted" message on success
    - Return 404 with "Match not found" if not found
    - Return 500 with error message on database error
    - Verify job document is not affected
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 9.1_
  
  - [ ]* 6.10 Write property test for match deletion
    - **Property 12: Match Deletion Removes Document**
    - **Property 13: Match Deletion Response Format**
    - **Property 14: Match Deletion Preserves Referenced Job**
    - **Validates: Requirements 6.1, 6.2, 6.4**

- [ ] 7. Implement health check endpoint
  - [x] 7.1 Create GET /api/health endpoint
    - Implement route handler returning health status
    - Return 200 with JSON containing status and message fields
    - _Requirements: 11.1, 11.2, 11.3, 11.4_
  
  - [ ]* 7.2 Write property test for health endpoint response structure
    - **Property 19: Health Endpoint Response Structure**
    - **Validates: Requirements 11.2, 11.3, 11.4**

- [ ] 8. Implement database seed script
  - [x] 8.1 Create seedJobs.js script
    - Load environment variables with dotenv
    - Connect to MongoDB using MONGODB_URI
    - Define sample job data (8 diverse job listings)
    - Clear existing jobs with deleteMany
    - Insert sample jobs with insertMany
    - Log number of jobs inserted
    - Close database connection and exit
    - Handle connection and insertion errors with logging
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [ ]* 8.2 Write property test for seed script
    - **Property 15: Seed Script Inserts Jobs**
    - **Validates: Requirements 7.3**

- [x] 9. Checkpoint - Ensure backend is fully functional
  - Run seed script to populate database
  - Test all endpoints with Postman or curl
  - Verify duplicate match prevention works
  - Verify error responses and logging
  - Ensure all tests pass, ask the user if questions arise

- [x] 10. Set up frontend API service layer
  - [x] 10.1 Create ApiService.js with configuration
    - Define API_BASE_URL from VITE_API_URL environment variable
    - Create .env.example for frontend with VITE_API_URL placeholder
    - _Requirements: 8.1_
  
  - [x] 10.2 Implement job API methods in ApiService
    - Implement fetchJobs() calling GET /api/jobs
    - Implement fetchJob(jobId) calling GET /api/jobs/:id
    - Add error handling for network failures and HTTP errors
    - Parse JSON responses
    - _Requirements: 8.1, 8.2, 9.2, 9.4_
  
  - [x] 10.3 Implement match API methods in ApiService
    - Implement fetchUserMatches(userId) calling GET /api/matches/user/:userId
    - Implement createMatch(userId, jobId) calling POST /api/matches
    - Implement markMatchApplied(matchId) calling PUT /api/matches/:id/apply
    - Implement deleteMatch(matchId) calling DELETE /api/matches/:id
    - Add error handling for all methods
    - _Requirements: 8.3, 8.4, 8.5, 8.6, 9.2, 9.4_
  
  - [x] 10.4 Implement health check method in ApiService
    - Implement checkHealth() calling GET /api/health
    - _Requirements: 11.1_
  
  - [ ]* 10.5 Write unit tests for ApiService
    - Test all API methods with mocked fetch
    - Test error handling for network failures
    - Test error handling for HTTP errors
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 9.2, 9.4_

- [x] 11. Update frontend StateManager to use ApiService
  - [x] 11.1 Replace StorageService with ApiService in StateManager
    - Import ApiService instead of StorageService
    - Convert all methods to async/await
    - _Requirements: 8.1_
  
  - [x] 11.2 Update loadJobs method
    - Call ApiService.fetchJobs()
    - Update state.jobs with response
    - Notify listeners
    - Handle errors and display user-friendly messages
    - _Requirements: 8.2, 9.2_
  
  - [x] 11.3 Update loadMatches method
    - Call ApiService.fetchUserMatches(userId)
    - Normalize API response to internal match structure
    - Update state.matches with normalized data
    - Notify listeners
    - Handle errors and display user-friendly messages
    - _Requirements: 8.3, 9.2_
  
  - [x] 11.4 Update addMatch method
    - Call ApiService.createMatch(userId, jobId)
    - Normalize API response to internal match structure
    - Update local state with normalized match
    - Notify listeners
    - Handle errors including duplicate match errors
    - _Requirements: 8.3, 9.2_
  
  - [x] 11.5 Update markAsApplied method
    - Call ApiService.markMatchApplied(matchId)
    - Normalize API response to internal match structure
    - Update local state with normalized match
    - Notify listeners
    - Handle errors and display user-friendly messages
    - _Requirements: 8.5, 9.2_
  
  - [x] 11.6 Update deleteMatch method
    - Call ApiService.deleteMatch(matchId)
    - Remove match from local state
    - Notify listeners
    - Handle errors and display user-friendly messages
    - _Requirements: 8.6, 9.2_
  
  - [ ]* 11.7 Write unit tests for updated StateManager
    - Test all async methods with mocked ApiService
    - Test error handling and user feedback
    - Test listener notifications
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 9.2_

- [x] 12. Implement frontend migration service
  - [x] 12.1 Create MigrationService.js
    - Define migration complete flag key for localStorage
    - Implement migrateLocalStorageToDatabase(userId, apiService, storageService)
    - Check if migration already completed, skip if true
    - Load matches from localStorage via storageService
    - For each match, call apiService.createMatch(userId, match.job.id)
    - If match.applied is true, call apiService.markMatchApplied(matchId)
    - Log individual match failures but continue with remaining matches
    - Clear localStorage via storageService.clear() after successful migration
    - Set migration complete flag in localStorage
    - Return migration summary with success and error counts
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_
  
  - [ ]* 12.2 Write property test for migration transfer
    - **Property 20: Migration Transfers LocalStorage Matches**
    - **Validates: Requirements 12.1**
  
  - [ ]* 12.3 Write property test for migration cleanup
    - **Property 21: Migration Cleanup**
    - **Validates: Requirements 12.2**
  
  - [ ]* 12.4 Write property test for migration idempotence
    - **Property 22: Migration Idempotence**
    - **Validates: Requirements 12.4**

- [x] 13. Integrate migration service into app initialization
  - [x] 13.1 Call migration service on app load
    - Import MigrationService in main app component
    - Check migration flag on component mount
    - If not migrated, call migrateLocalStorageToDatabase with userId
    - Display migration progress and results to user
    - Handle migration errors gracefully
    - _Requirements: 12.1, 12.3, 12.4, 12.5_
  
  - [ ]* 13.2 Write integration test for migration flow
    - Test migration runs on first load
    - Test migration skips on subsequent loads
    - Test partial failure handling
    - _Requirements: 12.1, 12.3, 12.4, 12.5_

- [x] 14. Checkpoint - Ensure frontend integration is complete
  - Test job listing loads from backend
  - Test creating matches stores in database
  - Test viewing matches retrieves from database
  - Test marking as applied updates database
  - Test deleting matches removes from database
  - Test migration transfers localStorage data
  - Verify error messages display correctly
  - Ensure all tests pass, ask the user if questions arise

- [ ] 15. Add comprehensive error handling and logging
  - [ ] 15.1 Enhance backend error logging
    - Add detailed logging for all database errors with context
    - Log connection state changes
    - Log all API errors with request details
    - Ensure no sensitive data in error messages
    - _Requirements: 9.1, 9.3, 9.5_
  
  - [ ] 15.2 Enhance frontend error display
    - Implement toast notifications for transient errors
    - Implement inline error messages for form validation
    - Display "Service unavailable" message when backend unreachable
    - Add retry logic with exponential backoff for transient failures
    - _Requirements: 9.2, 9.4_
  
  - [ ]* 15.3 Write property test for database error response format
    - **Property 16: Database Error Response Format**
    - **Validates: Requirements 9.1**
  
  - [ ]* 15.4 Write property test for database error logging
    - **Property 17: Database Error Logging**
    - **Validates: Requirements 9.5**

- [ ] 16. Add property-based tests for remaining properties
  - [ ]* 16.1 Write property test for match update response
    - **Property 10: Match Update Response Includes Applied Status**
    - **Validates: Requirements 5.2, 5.5**
  
  - [ ]* 16.2 Write property test for JSON request acceptance
    - **Property 18: JSON Request Acceptance**
    - **Validates: Requirements 10.5**

- [ ] 17. Final integration and verification
  - [ ] 17.1 Wire all components together
    - Verify backend server starts and connects to MongoDB
    - Verify frontend loads and calls backend APIs
    - Verify migration runs on first load
    - Verify all CRUD operations work end-to-end
    - _Requirements: All requirements_
  
  - [ ]* 17.2 Write end-to-end integration tests
    - Test complete user flow: browse jobs, match, apply, delete
    - Test data persistence across browser refresh
    - Test error scenarios end-to-end
    - _Requirements: All requirements_

- [ ] 18. Final checkpoint - Complete verification
  - Run all unit tests and verify they pass
  - Run all property tests and verify they pass
  - Run all integration tests and verify they pass
  - Test manually with browser and verify all functionality works
  - Verify migration works correctly
  - Verify error handling works correctly
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The implementation uses JavaScript/Node.js for backend and React for frontend
- MongoDB Atlas connection string must be configured in .env before starting
- Seed script should be run after backend setup to populate initial job data

# Design Document: MongoDB Atlas Integration

## Overview

This design document specifies the technical architecture for integrating MongoDB Atlas cloud database with the Job Swipe Matcher application. The integration replaces the current localStorage-based persistence with a cloud-hosted database solution, introducing a RESTful backend API built with Express.js and Mongoose ODM.

The system follows a three-tier architecture:
- **Frontend Layer**: React application that consumes REST APIs
- **Backend Layer**: Express.js server providing RESTful endpoints
- **Data Layer**: MongoDB Atlas cloud database

Key design goals:
- Maintain existing frontend functionality while replacing data persistence layer
- Provide reliable, scalable cloud-based data storage
- Enable multi-user support through centralized data management
- Ensure data consistency and validation at the database level
- Support seamless migration from localStorage to cloud storage

## Architecture

### System Architecture

```mermaid
graph TB
    subgraph "Frontend (React)"
        UI[User Interface Components]
        API[API Service Layer]
        State[State Manager]
    end
    
    subgraph "Backend (Express.js)"
        Server[Express Server]
        Routes[Route Handlers]
        Models[Mongoose Models]
        Middleware[Middleware Layer]
    end
    
    subgraph "Data Layer"
        Atlas[(MongoDB Atlas)]
    end
    
    UI --> State
    State --> API
    API -->|HTTP/JSON| Server
    Server --> Middleware
    Middleware --> Routes
    Routes --> Models
    Models -->|Mongoose ODM| Atlas
```

### Technology Stack

**Backend:**
- Node.js (ES Modules)
- Express.js 4.18+ (Web framework)
- Mongoose 8.0+ (MongoDB ODM)
- CORS middleware (Cross-origin support)
- dotenv (Environment configuration)

**Database:**
- MongoDB Atlas (Cloud-hosted MongoDB)
- Connection: mongodb+srv protocol with TLS
- Write concern: majority (w=majority)
- Retry writes: enabled

**Frontend:**
- React 18+ (UI framework)
- Fetch API (HTTP client)
- Existing state management system

### Connection Architecture

The backend establishes a single persistent connection to MongoDB Atlas on startup:

1. Server reads `MONGODB_URI` from environment configuration
2. Mongoose connects using connection string with retry logic
3. Connection success triggers HTTP server startup
4. Connection failure prevents server initialization
5. Mongoose maintains connection pool for concurrent requests

Connection options:
- `retryWrites=true`: Automatic retry for transient failures
- `w=majority`: Write acknowledged by majority of replica set
- Connection pooling: Mongoose default (5 connections)

## Components and Interfaces

### Backend Components

#### 1. Server Entry Point (`server.js`)

**Responsibilities:**
- Load environment configuration
- Initialize Express application
- Configure middleware (CORS, JSON parsing)
- Register route handlers
- Establish database connection
- Start HTTP server

**Configuration Loading:**
```javascript
// Required environment variables
MONGODB_URI    // MongoDB connection string
PORT           // Server port (default: 5000)
FRONTEND_URL   // Frontend origin for CORS (default: http://localhost:5173)
```

**Startup Sequence:**
1. Load dotenv configuration
2. Create Express app
3. Apply middleware
4. Register routes
5. Connect to MongoDB
6. Start listening on PORT

**Error Handling:**
- Missing `MONGODB_URI`: Log error and exit process
- Connection failure: Log error details, prevent server start
- Successful connection: Log success message, start server

#### 2. Mongoose Models

##### Job Model (`models/Job.js`)

**Schema Definition:**
```javascript
{
  title: String (required, trimmed)
  company: String (required, trimmed)
  description: String (required)
  salary: String (required)
  location: String (required)
  createdAt: Date (default: Date.now)
}
```

**Validation Rules:**
- All fields except `createdAt` are required
- `title` and `company` are trimmed of whitespace
- No custom validators (rely on required constraint)

**Indexes:**
- Default `_id` index (MongoDB automatic)
- `createdAt` index for sorting (implicit via queries)

##### Match Model (`models/Match.js`)

**Schema Definition:**
```javascript
{
  userId: String (required, indexed)
  jobId: ObjectId (required, ref: 'Job')
  applied: Boolean (default: false)
  matchedAt: Date (default: Date.now)
}
```

**Validation Rules:**
- `userId` and `jobId` are required
- `jobId` references Job collection

**Indexes:**
- Single field index on `userId` for user queries
- Compound unique index on `(userId, jobId)` to prevent duplicates

**Population:**
- `jobId` field can be populated with full Job document
- Used in GET endpoints to return complete match data

#### 3. Route Handlers

##### Job Routes (`routes/jobs.js`)

**GET /api/jobs**
- Purpose: Retrieve all job listings
- Query: `Job.find().sort({ createdAt: -1 })`
- Response: Array of job documents
- Status: 200 (success), 500 (error)

**GET /api/jobs/:id**
- Purpose: Retrieve single job by ID
- Query: `Job.findById(id)`
- Response: Job document or error
- Status: 200 (found), 404 (not found), 500 (error)

**POST /api/jobs**
- Purpose: Create new job listing
- Validation: Mongoose schema validation
- Response: Created job document
- Status: 201 (created), 400 (validation error)

**DELETE /api/jobs/:id**
- Purpose: Remove job listing
- Query: `Job.findById(id).deleteOne()`
- Response: Success message
- Status: 200 (deleted), 404 (not found), 500 (error)

##### Match Routes (`routes/matches.js`)

**GET /api/matches/user/:userId**
- Purpose: Retrieve all matches for a user
- Query: `Match.find({ userId }).populate('jobId').sort({ matchedAt: -1 })`
- Response: Array of populated match documents
- Status: 200 (success), 500 (error)

**POST /api/matches**
- Purpose: Create new match (user likes a job)
- Body: `{ userId, jobId }`
- Duplicate handling: Catch MongoDB error code 11000
- Response: Populated match document
- Status: 201 (created), 400 (duplicate or validation error)

**PUT /api/matches/:id/apply**
- Purpose: Mark match as applied
- Query: Find match, set `applied = true`, save
- Response: Populated updated match document
- Status: 200 (updated), 404 (not found), 500 (error)

**DELETE /api/matches/:id**
- Purpose: Remove match (user unlikes a job)
- Query: `Match.findById(id).deleteOne()`
- Response: Success message
- Status: 200 (deleted), 404 (not found), 500 (error)

##### Health Check Route

**GET /api/health**
- Purpose: Service health verification
- Response: `{ status: 'OK', message: 'Server is running' }`
- Status: 200 (always, if server is running)
- Note: Does not verify database connection status

#### 4. Middleware Layer

**CORS Middleware:**
```javascript
cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
})
```
- Allows requests from configured frontend origin
- Enables credentials for future authentication
- Defaults to Vite development server port

**JSON Body Parser:**
```javascript
express.json()
```
- Parses incoming JSON request bodies
- Makes data available in `req.body`

**Error Handling:**
- Route-level try-catch blocks
- Consistent error response format: `{ message: string }`
- HTTP status codes indicate error type

#### 5. Seed Script (`scripts/seedJobs.js`)

**Purpose:** Populate database with initial job listings

**Execution Flow:**
1. Load environment configuration
2. Connect to MongoDB Atlas
3. Clear existing jobs: `Job.deleteMany({})`
4. Insert sample jobs: `Job.insertMany(sampleJobs)`
5. Log insertion count
6. Close database connection
7. Exit process

**Sample Data:**
- 8 diverse job listings
- Fields: title, company, description, salary, location
- Represents various roles and locations

**Error Handling:**
- Connection errors: Log and exit with status 1
- Insertion errors: Log and exit with status 1

**Usage:**
```bash
npm run seed
```

### Frontend Components

#### 1. API Service Layer (New)

**Purpose:** Centralize all backend API communication

**Location:** `frontend/src/services/ApiService.js`

**Configuration:**
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

**Methods:**

**Job Operations:**
```javascript
async fetchJobs()
  // GET /api/jobs
  // Returns: Array of job objects

async fetchJob(jobId)
  // GET /api/jobs/:id
  // Returns: Single job object
```

**Match Operations:**
```javascript
async fetchUserMatches(userId)
  // GET /api/matches/user/:userId
  // Returns: Array of match objects with populated job data

async createMatch(userId, jobId)
  // POST /api/matches
  // Body: { userId, jobId }
  // Returns: Created match object with populated job data

async markMatchApplied(matchId)
  // PUT /api/matches/:id/apply
  // Returns: Updated match object with populated job data

async deleteMatch(matchId)
  // DELETE /api/matches/:id
  // Returns: Success message
```

**Health Check:**
```javascript
async checkHealth()
  // GET /api/health
  // Returns: Health status object
```

**Error Handling:**
- All methods use try-catch
- Network errors throw with descriptive messages
- HTTP errors (4xx, 5xx) throw with server message
- Caller responsible for user-facing error display

**Response Parsing:**
- All responses parsed as JSON
- Assumes server returns JSON for all endpoints

#### 2. State Manager Updates

**Current Behavior:**
- Uses `StorageService` for localStorage persistence
- Manages in-memory state with listener pattern
- Synchronous operations

**Required Changes:**
- Replace `StorageService` with `ApiService`
- Convert operations to async/await
- Handle API errors gracefully
- Maintain listener notification pattern

**Modified Methods:**

```javascript
async addMatch(job, userId)
  // Call ApiService.createMatch(userId, job.id)
  // Update local state with returned match
  // Notify listeners

async markAsApplied(matchId)
  // Call ApiService.markMatchApplied(matchId)
  // Update local state with returned match
  // Notify listeners

async deleteMatch(matchId)
  // Call ApiService.deleteMatch(matchId)
  // Remove from local state
  // Notify listeners

async loadMatches(userId)
  // Call ApiService.fetchUserMatches(userId)
  // Update state.matches
  // Notify listeners

async loadJobs()
  // Call ApiService.fetchJobs()
  // Update state.jobs
  // Notify listeners
```

**State Structure Changes:**
```javascript
// Old match structure
{
  job: { id, title, company, ... },
  matchedAt: Date,
  applied: Boolean
}

// New match structure (from API)
{
  _id: String,           // MongoDB ObjectId
  userId: String,
  jobId: { ... },        // Populated job document
  applied: Boolean,
  matchedAt: Date
}
```

**Adapter Pattern:**
- StateManager should normalize API responses to internal format
- Components continue using existing match structure
- Minimizes component changes

#### 3. Migration Service (New)

**Purpose:** One-time migration of localStorage data to database

**Location:** `frontend/src/services/MigrationService.js`

**Migration Flag:**
- Stored in localStorage: `job-swipe-migration-complete`
- Set to `'true'` after successful migration
- Checked on app initialization

**Migration Process:**

```javascript
async migrateLocalStorageToDatabase(userId, apiService, storageService)
  1. Check if migration already completed
  2. Load matches from localStorage via storageService
  3. For each match:
     a. Call apiService.createMatch(userId, match.job.id)
     b. If match.applied, call apiService.markMatchApplied(matchId)
     c. Log errors but continue with remaining matches
  4. Clear localStorage via storageService.clear()
  5. Set migration complete flag
  6. Return migration summary (success count, error count)
```

**Error Handling:**
- Individual match failures don't stop migration
- Collect errors for logging
- User notified of partial failures
- Migration marked complete even with errors (prevents retry loops)

**Invocation:**
- Called once during app initialization
- Only if migration flag not set
- Requires userId (from future auth or temporary ID)

## Data Models

### Job Document

**Collection:** `jobs`

**Schema:**
```javascript
{
  _id: ObjectId,              // MongoDB generated
  title: String,              // Required, trimmed
  company: String,            // Required, trimmed
  description: String,        // Required
  salary: String,             // Required
  location: String,           // Required
  createdAt: Date,            // Auto-generated
  __v: Number                 // Mongoose version key
}
```

**Example:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Senior Frontend Developer",
  "company": "TechCorp Inc.",
  "description": "We are looking for an experienced frontend developer...",
  "salary": "$120,000 - $150,000",
  "location": "San Francisco, CA",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "__v": 0
}
```

**Constraints:**
- All fields required except `_id`, `createdAt`, `__v`
- `title` and `company` automatically trimmed
- No maximum length constraints
- No uniqueness constraints (duplicate jobs allowed)

**Indexes:**
- Primary: `_id` (automatic)
- Query pattern: Sort by `createdAt` descending

### Match Document

**Collection:** `matches`

**Schema:**
```javascript
{
  _id: ObjectId,              // MongoDB generated
  userId: String,             // Required, indexed
  jobId: ObjectId,            // Required, references jobs
  applied: Boolean,           // Default: false
  matchedAt: Date,            // Auto-generated
  __v: Number                 // Mongoose version key
}
```

**Example:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "user123",
  "jobId": "507f1f77bcf86cd799439011",
  "applied": false,
  "matchedAt": "2024-01-15T14:20:00.000Z",
  "__v": 0
}
```

**Populated Example (API Response):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "user123",
  "jobId": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Senior Frontend Developer",
    "company": "TechCorp Inc.",
    "description": "We are looking for...",
    "salary": "$120,000 - $150,000",
    "location": "San Francisco, CA",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "applied": false,
  "matchedAt": "2024-01-15T14:20:00.000Z",
  "__v": 0
}
```

**Constraints:**
- `userId` and `jobId` required
- Compound unique index on `(userId, jobId)` prevents duplicate matches
- `jobId` must reference valid Job document (referential integrity not enforced)

**Indexes:**
- Primary: `_id` (automatic)
- Single: `userId` (for user queries)
- Compound unique: `{ userId: 1, jobId: 1 }`
- Query patterns: 
  - Find by userId, sort by matchedAt descending
  - Populate jobId reference

### Environment Configuration

**File:** `backend/.env`

**Template:** `backend/.env.example`

**Required Variables:**
```bash
# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/job-swipe-matcher?retryWrites=true&w=majority

# Server port
PORT=5000

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```

**Frontend Configuration:**

**File:** `frontend/.env`

**Required Variables:**
```bash
# Backend API base URL
VITE_API_URL=http://localhost:5000/api
```

**Security Considerations:**
- `.env` files excluded from version control
- `.env.example` provides template without credentials
- Connection string contains database credentials
- Never commit actual credentials to repository

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Job Document Schema Completeness

*For any* job document created through the API, the stored document SHALL contain all required fields: title, company, description, salary, location, and createdAt.

**Validates: Requirements 3.1**

### Property 2: Job Listing Sort Order

*For any* set of job documents in the database, when retrieved via GET /api/jobs, the returned array SHALL be sorted by createdAt in descending order (newest first).

**Validates: Requirements 3.2**

### Property 3: Job Retrieval Round Trip

*For any* job document created in the database, retrieving it by its ID via GET /api/jobs/:id SHALL return a document with identical field values.

**Validates: Requirements 3.3**

### Property 4: Job Validation Rejects Incomplete Data

*For any* job creation request missing one or more required fields (title, company, description, salary, location), the API SHALL reject the request and return an error response.

**Validates: Requirements 3.5**

### Property 5: Match Document Schema Completeness

*For any* match document created through the API, the stored document SHALL contain all required fields: userId, jobId, applied, and matchedAt.

**Validates: Requirements 4.1**

### Property 6: Match Creation Round Trip

*For any* valid userId and jobId, creating a match via POST /api/matches SHALL store the match and return a response with the match document populated with complete job details.

**Validates: Requirements 4.2**

### Property 7: User Matches Sort Order

*For any* userId with one or more matches, retrieving matches via GET /api/matches/user/:userId SHALL return an array sorted by matchedAt in descending order (newest first) with populated job details.

**Validates: Requirements 4.3**

### Property 8: Duplicate Match Prevention

*For any* userId and jobId pair, attempting to create a second match with the same pair SHALL fail due to the unique compound index constraint.

**Validates: Requirements 4.4**

### Property 9: Match Applied Status Update

*For any* existing match document, calling PUT /api/matches/:id/apply SHALL update the applied field to true in the database.

**Validates: Requirements 5.1**

### Property 10: Match Update Response Includes Applied Status

*For any* match update operation (marking as applied) or match retrieval operation, the returned match document SHALL include the applied field with its current value and populated job details.

**Validates: Requirements 5.2, 5.5**

### Property 11: Match Timestamp Invariant

*For any* match document, updating the applied status SHALL preserve the original matchedAt timestamp value without modification.

**Validates: Requirements 5.4**

### Property 12: Match Deletion Removes Document

*For any* match document, calling DELETE /api/matches/:id SHALL remove the match from the database such that subsequent retrieval attempts return 404.

**Validates: Requirements 6.1**

### Property 13: Match Deletion Response Format

*For any* successful match deletion, the API SHALL return HTTP status 200 with a JSON response containing message "Match deleted".

**Validates: Requirements 6.2**

### Property 14: Match Deletion Preserves Referenced Job

*For any* match document referencing a job, deleting the match SHALL not affect the referenced job document in the Job collection.

**Validates: Requirements 6.4**

### Property 15: Seed Script Inserts Jobs

*For any* execution of the seed script with valid database connection, the script SHALL insert job documents into the Job collection and the count of inserted documents SHALL match the count of jobs in the seed data.

**Validates: Requirements 7.3**

### Property 16: Database Error Response Format

*For any* API request that encounters a database error, the API SHALL return HTTP status 500 with a JSON response containing a descriptive error message.

**Validates: Requirements 9.1**

### Property 17: Database Error Logging

*For any* database error encountered during API operations, the backend SHALL write a log entry containing error details sufficient for debugging.

**Validates: Requirements 9.5**

### Property 18: JSON Request Acceptance

*For any* API request with Content-Type application/json and valid JSON body, the backend SHALL successfully parse the request body and make it available to route handlers.

**Validates: Requirements 10.5**

### Property 19: Health Endpoint Response Structure

*For any* request to GET /api/health, the API SHALL return HTTP status 200 with a JSON response containing both a status field and a message field.

**Validates: Requirements 11.2, 11.3, 11.4**

### Property 20: Migration Transfers LocalStorage Matches

*For any* user with matches stored in localStorage, executing the migration process SHALL create corresponding match documents in the database for each localStorage match.

**Validates: Requirements 12.1**

### Property 21: Migration Cleanup

*For any* successful migration execution, the migration process SHALL clear all match data from localStorage after transferring to the database.

**Validates: Requirements 12.2**

### Property 22: Migration Idempotence

*For any* user, executing the migration process multiple times SHALL not create duplicate match documents in the database.

**Validates: Requirements 12.4**

## Error Handling

### Backend Error Handling

**Database Connection Errors:**
- **Startup Connection Failure**: If MongoDB connection fails during server startup, log error details and exit process without starting HTTP server
- **Runtime Connection Loss**: Mongoose automatically attempts reconnection with exponential backoff; log connection state changes
- **Connection Timeout**: Default Mongoose timeout (30 seconds); configurable via connection options

**Request Validation Errors:**
- **Missing Required Fields**: Return 400 Bad Request with message indicating which fields are missing
- **Invalid ObjectId Format**: Mongoose validation returns 500; should be caught and returned as 400
- **Duplicate Match**: Catch MongoDB error code 11000, return 400 with message "Already matched with this job"

**Resource Not Found Errors:**
- **Job Not Found**: Return 404 with message "Job not found"
- **Match Not Found**: Return 404 with message "Match not found"
- **Consistent Format**: All 404 responses use same JSON structure: `{ message: string }`

**Database Operation Errors:**
- **Query Failures**: Catch all database errors in try-catch blocks
- **Response Format**: Return 500 with `{ message: error.message }`
- **Logging**: Log full error object with stack trace for debugging
- **No Sensitive Data**: Ensure error messages don't expose connection strings or credentials

**Error Response Structure:**
```javascript
{
  message: string  // Human-readable error description
}
```

### Frontend Error Handling

**API Communication Errors:**
- **Network Failure**: Catch fetch errors, display "Unable to connect to server"
- **Timeout**: Implement request timeout (e.g., 10 seconds), display timeout message
- **HTTP Errors**: Check response.ok, parse error message from response body

**Error Display Strategy:**
- **Toast Notifications**: Brief error messages for transient failures
- **Inline Messages**: Persistent error display for form validation
- **Fallback UI**: Show cached data or empty state when API unavailable

**Migration Errors:**
- **Partial Failure**: Log individual match migration failures, continue with remaining matches
- **Complete Failure**: If no matches migrate successfully, keep localStorage data and retry on next load
- **User Notification**: Display summary of migration results (success count, failure count)

**Error Recovery:**
- **Retry Logic**: Implement exponential backoff for transient failures
- **Graceful Degradation**: Allow read-only access if write operations fail
- **User Feedback**: Always inform user of error state and available actions

### Logging Strategy

**Backend Logging:**
- **Startup Events**: Connection success/failure, server start
- **Database Operations**: Log errors with operation context (collection, operation type)
- **Request Errors**: Log request path, method, error message
- **Performance**: Consider logging slow queries (>100ms)

**Frontend Logging:**
- **API Errors**: Log to console with request details
- **Migration Events**: Log migration start, progress, completion
- **User Actions**: Consider analytics for user behavior tracking

**Log Levels:**
- **Error**: Database failures, connection issues, unhandled exceptions
- **Warn**: Validation failures, resource not found
- **Info**: Startup events, successful operations
- **Debug**: Detailed operation traces (development only)

## Testing Strategy

### Testing Approach

This feature requires a dual testing approach combining unit tests for specific scenarios and property-based tests for comprehensive validation:

**Unit Tests:**
- Specific API endpoint examples (GET, POST, PUT, DELETE)
- Edge cases (missing fields, invalid IDs, duplicates)
- Error conditions (404, 400, 500 responses)
- Configuration loading and validation
- Migration service specific scenarios

**Property-Based Tests:**
- Universal properties across all valid inputs
- Schema validation for all documents
- Sort order consistency for any dataset
- Round-trip properties (create-retrieve-delete cycles)
- Invariant preservation (timestamps, referential integrity)

### Property-Based Testing Configuration

**Framework Selection:**
- **Backend (JavaScript/Node.js)**: Use `fast-check` library
- **Frontend (JavaScript/React)**: Use `fast-check` library
- **Installation**: `npm install --save-dev fast-check`

**Test Configuration:**
- **Minimum Iterations**: 100 runs per property test
- **Seed**: Use fixed seed for reproducible failures
- **Shrinking**: Enable automatic shrinking to find minimal failing case

**Property Test Structure:**
```javascript
import fc from 'fast-check';

// Example property test
test('Property 1: Job Document Schema Completeness', () => {
  fc.assert(
    fc.property(
      fc.record({
        title: fc.string({ minLength: 1 }),
        company: fc.string({ minLength: 1 }),
        description: fc.string({ minLength: 1 }),
        salary: fc.string({ minLength: 1 }),
        location: fc.string({ minLength: 1 })
      }),
      async (jobData) => {
        const response = await request(app)
          .post('/api/jobs')
          .send(jobData);
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('title', jobData.title);
        expect(response.body).toHaveProperty('company', jobData.company);
        expect(response.body).toHaveProperty('description', jobData.description);
        expect(response.body).toHaveProperty('salary', jobData.salary);
        expect(response.body).toHaveProperty('location', jobData.location);
        expect(response.body).toHaveProperty('createdAt');
      }
    ),
    { numRuns: 100 }
  );
});
```

**Property Test Tags:**
Each property test MUST include a comment tag referencing the design document:

```javascript
// Feature: mongodb-atlas-integration, Property 1: Job Document Schema Completeness
test('Property 1: Job Document Schema Completeness', () => { ... });

// Feature: mongodb-atlas-integration, Property 8: Duplicate Match Prevention
test('Property 8: Duplicate Match Prevention', () => { ... });
```

### Backend Testing

**Test Structure:**
```
backend/
  tests/
    unit/
      models/
        Job.test.js
        Match.test.js
      routes/
        jobs.test.js
        matches.test.js
    integration/
      api.test.js
      database.test.js
    property/
      jobs.property.test.js
      matches.property.test.js
    scripts/
      seedJobs.test.js
```

**Unit Test Coverage:**
- Model validation (required fields, data types)
- Route handlers (success and error paths)
- Middleware (CORS, JSON parsing)
- Error response formats
- Seed script execution

**Integration Test Coverage:**
- Full request-response cycles
- Database connection and operations
- Populated queries (match with job details)
- Duplicate prevention (unique indexes)

**Property Test Coverage:**
- Properties 1-19 (all backend properties)
- Random data generation for jobs and matches
- Sort order verification
- Round-trip properties
- Invariant preservation

**Test Database:**
- Use separate test database (e.g., `job-swipe-matcher-test`)
- Clear database before each test suite
- Use in-memory MongoDB for faster tests (mongodb-memory-server)

**Mocking Strategy:**
- Mock MongoDB connection for unit tests
- Use real database for integration and property tests
- Mock external dependencies (if any added later)

### Frontend Testing

**Test Structure:**
```
frontend/
  tests/
    unit/
      services/
        ApiService.test.js
        MigrationService.test.js
      state/
        StateManager.test.js
    integration/
      api-integration.test.js
    property/
      migration.property.test.js
```

**Unit Test Coverage:**
- ApiService methods (all CRUD operations)
- MigrationService logic
- StateManager async operations
- Error handling and display

**Integration Test Coverage:**
- Full API communication flow
- State updates after API calls
- Migration process end-to-end

**Property Test Coverage:**
- Property 20-22 (migration properties)
- Random localStorage data generation
- Migration idempotence
- Cleanup verification

**Mocking Strategy:**
- Mock fetch API for unit tests
- Use MSW (Mock Service Worker) for integration tests
- Mock localStorage for migration tests

### Test Data Generation

**Job Data Generators (fast-check):**
```javascript
const jobArbitrary = fc.record({
  title: fc.string({ minLength: 1, maxLength: 100 }),
  company: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.string({ minLength: 10, maxLength: 500 }),
  salary: fc.string({ minLength: 1, maxLength: 50 }),
  location: fc.string({ minLength: 1, maxLength: 100 })
});
```

**Match Data Generators:**
```javascript
const matchArbitrary = fc.record({
  userId: fc.string({ minLength: 1, maxLength: 50 }),
  jobId: fc.hexaString({ minLength: 24, maxLength: 24 }), // MongoDB ObjectId
  applied: fc.boolean()
});
```

**Edge Case Generators:**
```javascript
// Empty strings, whitespace, special characters
const invalidJobArbitrary = fc.record({
  title: fc.oneof(fc.constant(''), fc.constant('   ')),
  company: fc.string(),
  description: fc.string(),
  salary: fc.string(),
  location: fc.string()
});
```

### Continuous Integration

**CI Pipeline:**
1. Install dependencies
2. Run linter
3. Run unit tests
4. Run integration tests
5. Run property tests
6. Generate coverage report
7. Fail if coverage below threshold (e.g., 80%)

**Test Execution:**
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:property

# Run with coverage
npm run test:coverage
```

### Manual Testing Checklist

**Backend:**
- [ ] Server starts successfully with valid .env
- [ ] Server fails gracefully with missing .env
- [ ] Health endpoint returns 200
- [ ] All CRUD operations work via Postman/curl
- [ ] Duplicate match returns 400
- [ ] Invalid job ID returns 404
- [ ] CORS allows frontend origin

**Frontend:**
- [ ] Jobs load on application start
- [ ] Matching a job creates match in database
- [ ] Matches display with correct job details
- [ ] Marking as applied updates database
- [ ] Deleting match removes from database
- [ ] Migration transfers localStorage data
- [ ] Migration runs only once
- [ ] Error messages display for API failures

**End-to-End:**
- [ ] Fresh user can browse jobs
- [ ] User can match multiple jobs
- [ ] User can view all matches
- [ ] User can mark jobs as applied
- [ ] User can remove matches
- [ ] Data persists across browser refresh
- [ ] Multiple users have separate match lists

## Implementation Notes

### Development Workflow

**Phase 1: Backend Setup**
1. Verify MongoDB Atlas cluster is created
2. Create database user with read/write permissions
3. Configure IP whitelist (allow all for development: 0.0.0.0/0)
4. Copy connection string to .env file
5. Test connection with seed script
6. Verify models and routes work with Postman

**Phase 2: Frontend Integration**
1. Create ApiService with all methods
2. Update StateManager to use ApiService
3. Test each operation individually
4. Implement error handling and display

**Phase 3: Migration**
1. Implement MigrationService
2. Test with sample localStorage data
3. Verify cleanup and idempotence
4. Add user notification for migration status

**Phase 4: Testing**
1. Write unit tests for all components
2. Write property tests for all properties
3. Run full test suite
4. Fix any failing tests
5. Verify coverage meets threshold

### Deployment Considerations

**Environment Variables:**
- Production: Use secure environment variable management (e.g., Vercel env vars, AWS Secrets Manager)
- Never commit .env files to version control
- Rotate database credentials periodically

**Database Security:**
- Production: Restrict IP whitelist to application servers only
- Use strong passwords for database users
- Enable MongoDB Atlas audit logging
- Regular backups (Atlas automatic backups)

**API Security:**
- Add rate limiting to prevent abuse
- Implement authentication (future requirement)
- Validate all user inputs
- Sanitize data before database operations

**Performance:**
- Monitor query performance with MongoDB Atlas metrics
- Add indexes for frequently queried fields
- Consider caching for read-heavy operations
- Implement pagination for large result sets

**Monitoring:**
- Set up MongoDB Atlas alerts for connection issues
- Monitor API response times
- Track error rates
- Log aggregation for debugging

### Future Enhancements

**Authentication:**
- Replace temporary userId with real user authentication
- Implement JWT tokens for API security
- Add user registration and login

**Advanced Features:**
- Job search and filtering
- Job recommendations based on matches
- Email notifications for new jobs
- Application tracking with status updates

**Performance Optimization:**
- Implement Redis caching for job listings
- Add pagination to match listings
- Optimize database queries with explain plans
- Consider read replicas for scaling

**Data Management:**
- Admin interface for job management
- Bulk job import from external sources
- Data export for users
- Analytics dashboard for job statistics

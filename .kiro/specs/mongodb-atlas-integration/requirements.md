# Requirements Document

## Introduction

This document specifies the requirements for integrating MongoDB Atlas cloud database with the Job Swipe Matcher application. The integration will replace the current local storage and sample data approach with persistent cloud-based data storage, enabling the application to store job listings, user matches, and application tracking data in MongoDB Atlas while maintaining all existing frontend functionality.

## Glossary

- **Backend_API**: The Node.js/Express server that handles HTTP requests and database operations
- **Frontend_Application**: The React application that provides the user interface
- **MongoDB_Atlas**: The cloud-hosted MongoDB database service
- **Job_Collection**: MongoDB collection storing job listing documents
- **Match_Collection**: MongoDB collection storing user match and application documents
- **Database_Connection**: The active connection between Backend_API and MongoDB_Atlas
- **API_Endpoint**: HTTP route that Frontend_Application calls to interact with data
- **Seed_Script**: Script that populates initial job data into Job_Collection
- **Environment_Configuration**: Configuration file containing database credentials and connection settings
- **Storage_Service**: Frontend service currently using localStorage for data persistence
- **Connection_String**: MongoDB URI containing credentials and cluster information for connecting to MongoDB_Atlas

## Requirements

### Requirement 1: Database Connection Configuration

**User Story:** As a developer, I want to configure MongoDB Atlas connection settings, so that the Backend_API can securely connect to the cloud database.

#### Acceptance Criteria

1. THE Backend_API SHALL read Connection_String from Environment_Configuration
2. THE Backend_API SHALL read database name from Environment_Configuration
3. WHEN Environment_Configuration is missing required values, THEN THE Backend_API SHALL log a descriptive error and exit
4. THE Environment_Configuration SHALL include a template file with placeholder values for Connection_String, PORT, and FRONTEND_URL
5. THE Connection_String SHALL use the format mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

### Requirement 2: Database Connection Establishment

**User Story:** As a developer, I want the Backend_API to establish a connection to MongoDB Atlas, so that the application can perform database operations.

#### Acceptance Criteria

1. WHEN Backend_API starts, THE Backend_API SHALL attempt to connect to MongoDB_Atlas using Connection_String
2. WHEN Database_Connection succeeds, THE Backend_API SHALL log a success message and start the HTTP server
3. IF Database_Connection fails, THEN THE Backend_API SHALL log the error details and prevent server startup
4. THE Database_Connection SHALL use mongoose connection options retryWrites=true and w=majority
5. WHEN Database_Connection is established, THE Backend_API SHALL be ready to handle API requests

### Requirement 3: Job Data Storage and Retrieval

**User Story:** As a user, I want job listings to be stored in the database, so that job data persists across sessions and is available to all users.

#### Acceptance Criteria

1. THE Backend_API SHALL store job documents in Job_Collection with fields: title, company, description, salary, location, and createdAt
2. WHEN Frontend_Application requests job listings, THE Backend_API SHALL retrieve all documents from Job_Collection sorted by createdAt in descending order
3. WHEN Frontend_Application requests a specific job by ID, THE Backend_API SHALL retrieve the matching document from Job_Collection
4. IF a requested job ID does not exist, THEN THE Backend_API SHALL return HTTP status 404 with message "Job not found"
5. THE Backend_API SHALL validate that title, company, description, salary, and location are present before storing a job document

### Requirement 4: Match Data Storage and Retrieval

**User Story:** As a user, I want my job matches and applications to be stored in the database, so that my activity is preserved across sessions.

#### Acceptance Criteria

1. THE Backend_API SHALL store match documents in Match_Collection with fields: userId, jobId, applied, and matchedAt
2. WHEN Frontend_Application creates a match, THE Backend_API SHALL store the match document and return the populated match with job details
3. WHEN Frontend_Application requests matches for a user, THE Backend_API SHALL retrieve all match documents for that userId with populated job details sorted by matchedAt in descending order
4. THE Backend_API SHALL prevent duplicate matches by enforcing a unique compound index on userId and jobId
5. IF a duplicate match is attempted, THEN THE Backend_API SHALL return HTTP status 400 with message "Already matched with this job"

### Requirement 5: Application Status Tracking

**User Story:** As a user, I want to mark jobs as applied, so that I can track which positions I have already applied to.

#### Acceptance Criteria

1. WHEN Frontend_Application marks a match as applied, THE Backend_API SHALL update the applied field to true in Match_Collection
2. WHEN the applied status is updated, THE Backend_API SHALL return the updated match document with populated job details
3. IF the match ID does not exist, THEN THE Backend_API SHALL return HTTP status 404 with message "Match not found"
4. THE Backend_API SHALL preserve the original matchedAt timestamp when updating applied status
5. WHEN Frontend_Application retrieves user matches, THE Backend_API SHALL include the applied status for each match

### Requirement 6: Match Deletion

**User Story:** As a user, I want to remove job matches, so that I can manage my list of saved jobs.

#### Acceptance Criteria

1. WHEN Frontend_Application requests match deletion, THE Backend_API SHALL remove the match document from Match_Collection
2. WHEN a match is successfully deleted, THE Backend_API SHALL return HTTP status 200 with message "Match deleted"
3. IF the match ID does not exist, THEN THE Backend_API SHALL return HTTP status 404 with message "Match not found"
4. THE Backend_API SHALL delete only the match document without affecting the referenced job document in Job_Collection

### Requirement 7: Initial Data Population

**User Story:** As a developer, I want to populate the database with initial job listings, so that users have jobs to browse when first using the application.

#### Acceptance Criteria

1. THE Seed_Script SHALL read job data from a source file or inline data structure
2. WHEN Seed_Script executes, THE Seed_Script SHALL connect to MongoDB_Atlas using Connection_String from Environment_Configuration
3. WHEN Seed_Script connects successfully, THE Seed_Script SHALL insert job documents into Job_Collection
4. WHEN Seed_Script completes, THE Seed_Script SHALL log the number of jobs inserted and close Database_Connection
5. IF Seed_Script encounters an error, THEN THE Seed_Script SHALL log the error details and exit with non-zero status

### Requirement 8: Frontend API Integration

**User Story:** As a user, I want the frontend to fetch data from the backend API, so that I see real-time data from the database instead of sample data.

#### Acceptance Criteria

1. THE Frontend_Application SHALL call Backend_API endpoints instead of using Storage_Service for job data
2. WHEN Frontend_Application loads, THE Frontend_Application SHALL fetch job listings from GET /api/jobs endpoint
3. WHEN a user matches a job, THE Frontend_Application SHALL send a POST request to /api/matches endpoint with userId and jobId
4. WHEN a user views their matches, THE Frontend_Application SHALL fetch matches from GET /api/matches/user/:userId endpoint
5. WHEN a user marks a job as applied, THE Frontend_Application SHALL send a PUT request to /api/matches/:id/apply endpoint
6. WHEN a user removes a match, THE Frontend_Application SHALL send a DELETE request to /api/matches/:id endpoint

### Requirement 9: Error Handling and User Feedback

**User Story:** As a user, I want to see meaningful error messages when something goes wrong, so that I understand what happened and can take appropriate action.

#### Acceptance Criteria

1. WHEN Backend_API encounters a database error, THE Backend_API SHALL return HTTP status 500 with a descriptive error message
2. WHEN Frontend_Application receives an error response, THE Frontend_Application SHALL display a user-friendly error message
3. IF Database_Connection is lost during operation, THEN THE Backend_API SHALL log the connection loss and attempt to reconnect
4. WHEN Frontend_Application cannot reach Backend_API, THE Frontend_Application SHALL display a message indicating the service is unavailable
5. THE Backend_API SHALL log all database errors with sufficient detail for debugging

### Requirement 10: CORS Configuration

**User Story:** As a developer, I want the backend to accept requests from the frontend, so that the frontend can communicate with the API without CORS errors.

#### Acceptance Criteria

1. THE Backend_API SHALL configure CORS middleware to accept requests from the frontend origin
2. THE Backend_API SHALL read the allowed frontend origin from Environment_Configuration
3. WHEN Environment_Configuration does not specify FRONTEND_URL, THE Backend_API SHALL default to http://localhost:5173
4. THE Backend_API SHALL allow credentials in CORS requests
5. THE Backend_API SHALL accept requests with Content-Type application/json

### Requirement 11: Health Check Endpoint

**User Story:** As a developer, I want a health check endpoint, so that I can verify the backend service is running and connected to the database.

#### Acceptance Criteria

1. THE Backend_API SHALL provide a GET /api/health endpoint
2. WHEN the health endpoint is called, THE Backend_API SHALL return HTTP status 200 with a JSON response
3. THE health endpoint response SHALL include a status field indicating service health
4. THE health endpoint response SHALL include a message field with descriptive text
5. WHEN Database_Connection is active, THE health endpoint SHALL indicate the database connection status

### Requirement 12: Data Migration from Local Storage

**User Story:** As a user, I want my existing matches to be preserved when switching to the database, so that I don't lose my saved jobs.

#### Acceptance Criteria

1. WHERE the user has existing matches in Storage_Service, THE Frontend_Application SHALL migrate those matches to Match_Collection on first load
2. WHEN migration completes successfully, THE Frontend_Application SHALL clear the local storage data
3. IF migration fails for any match, THEN THE Frontend_Application SHALL log the error and continue with remaining matches
4. THE Frontend_Application SHALL perform migration only once per user
5. WHEN migration is complete, THE Frontend_Application SHALL use Backend_API for all subsequent operations


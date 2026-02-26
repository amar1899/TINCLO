# Postman API Testing Guide for TINCLO

## Prerequisites
- Backend server running on `http://localhost:5000`
- Postman installed (download from https://www.postman.com/downloads/)

## Base URL
```
http://localhost:5000/api
```

---

## 1. Health Check API

### Test Server Status
**Method:** GET  
**URL:** `http://localhost:5000/api/health`

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## 2. Jobs API

### 2.1 Get All Jobs
**Method:** GET  
**URL:** `http://localhost:5000/api/jobs`

**Expected Response:** Array of job objects
```json
[
  {
    "_id": "699dec03e86c1b1fcc2d6bff",
    "title": "Product Manager",
    "company": "ProductCo",
    "description": "Lead product strategy...",
    "location": "San Francisco, CA",
    "salary": "$120k - $160k",
    "type": "Full-time",
    "requirements": ["5+ years experience", "..."],
    "benefits": ["Health insurance", "..."]
  }
]
```

### 2.2 Get Single Job
**Method:** GET  
**URL:** `http://localhost:5000/api/jobs/{jobId}`

**Example:** `http://localhost:5000/api/jobs/699dec03e86c1b1fcc2d6bff`

**Expected Response:** Single job object

---

## 3. Users API (NEW - Fixed Feature)

### 3.1 Create User
**Method:** POST  
**URL:** `http://localhost:5000/api/users`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "userId": "test-user-123"
}
```

**Expected Response:**
```json
{
  "_id": "67a1b2c3d4e5f6g7h8i9j0k1",
  "userId": "test-user-123",
  "createdAt": "2026-02-26T10:30:00.000Z",
  "__v": 0
}
```

**Error Response (Duplicate User):**
```json
{
  "message": "User already exists"
}
```

### 3.2 Get User by userId
**Method:** GET  
**URL:** `http://localhost:5000/api/users/{userId}`

**Example:** `http://localhost:5000/api/users/test-user-123`

**Expected Response:**
```json
{
  "_id": "67a1b2c3d4e5f6g7h8i9j0k1",
  "userId": "test-user-123",
  "createdAt": "2026-02-26T10:30:00.000Z",
  "__v": 0
}
```

**Error Response (User Not Found):**
```json
{
  "message": "User not found"
}
```

---

## 4. Matches API (Like/Unlike Jobs)

### 4.1 Create Match (Like a Job)
**Method:** POST  
**URL:** `http://localhost:5000/api/matches`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "userId": "test-user-123",
  "jobId": "699dec03e86c1b1fcc2d6bff"
}
```

**Expected Response:**
```json
{
  "_id": "67a1b2c3d4e5f6g7h8i9j0k2",
  "userId": "test-user-123",
  "jobId": {
    "_id": "699dec03e86c1b1fcc2d6bff",
    "title": "Product Manager",
    "company": "ProductCo",
    "description": "...",
    "location": "San Francisco, CA",
    "salary": "$120k - $160k"
  },
  "applied": false,
  "matchedAt": "2026-02-26T10:35:00.000Z",
  "__v": 0
}
```

**Error Response (User Not Found):**
```json
{
  "message": "User not found. Please create user first."
}
```

**Error Response (Duplicate Match):**
```json
{
  "message": "Already matched with this job"
}
```

### 4.2 Get User Matches
**Method:** GET  
**URL:** `http://localhost:5000/api/matches/user/{userId}`

**Example:** `http://localhost:5000/api/matches/user/test-user-123`

**Expected Response:** Array of matches with populated job details
```json
[
  {
    "_id": "67a1b2c3d4e5f6g7h8i9j0k2",
    "userId": "test-user-123",
    "jobId": {
      "_id": "699dec03e86c1b1fcc2d6bff",
      "title": "Product Manager",
      "company": "ProductCo",
      "location": "San Francisco, CA"
    },
    "applied": false,
    "matchedAt": "2026-02-26T10:35:00.000Z"
  }
]
```

### 4.3 Mark Match as Applied
**Method:** PUT  
**URL:** `http://localhost:5000/api/matches/{matchId}/apply`

**Example:** `http://localhost:5000/api/matches/67a1b2c3d4e5f6g7h8i9j0k2/apply`

**Expected Response:**
```json
{
  "_id": "67a1b2c3d4e5f6g7h8i9j0k2",
  "userId": "test-user-123",
  "jobId": {
    "_id": "699dec03e86c1b1fcc2d6bff",
    "title": "Product Manager",
    "company": "ProductCo"
  },
  "applied": true,
  "matchedAt": "2026-02-26T10:35:00.000Z"
}
```

### 4.4 Delete Match (Unlike a Job)
**Method:** DELETE  
**URL:** `http://localhost:5000/api/matches/{matchId}`

**Example:** `http://localhost:5000/api/matches/67a1b2c3d4e5f6g7h8i9j0k2`

**Expected Response:**
```json
{
  "message": "Match deleted"
}
```

---

## Complete Testing Workflow

### Step-by-Step Testing Procedure:

#### Step 1: Check Server Health
1. Open Postman
2. Create new request: GET `http://localhost:5000/api/health`
3. Click "Send"
4. Verify response: `{"status":"OK","message":"Server is running"}`

#### Step 2: Get Available Jobs
1. Create new request: GET `http://localhost:5000/api/jobs`
2. Click "Send"
3. Copy a `_id` from any job (you'll need this for creating matches)

#### Step 3: Create a User
1. Create new request: POST `http://localhost:5000/api/users`
2. Set Headers: `Content-Type: application/json`
3. Set Body (raw JSON):
   ```json
   {
     "userId": "test-user-123"
   }
   ```
4. Click "Send"
5. Verify user is created successfully

#### Step 4: Verify User Exists
1. Create new request: GET `http://localhost:5000/api/users/test-user-123`
2. Click "Send"
3. Verify user details are returned

#### Step 5: Create a Match (Like a Job)
1. Create new request: POST `http://localhost:5000/api/matches`
2. Set Headers: `Content-Type: application/json`
3. Set Body (raw JSON):
   ```json
   {
     "userId": "test-user-123",
     "jobId": "699dec03e86c1b1fcc2d6bff"
   }
   ```
   (Use the jobId you copied from Step 2)
4. Click "Send"
5. Verify match is created with populated job details
6. Copy the match `_id` for next steps

#### Step 6: Get User's Matches
1. Create new request: GET `http://localhost:5000/api/matches/user/test-user-123`
2. Click "Send"
3. Verify you see the match you just created

#### Step 7: Mark Match as Applied
1. Create new request: PUT `http://localhost:5000/api/matches/{matchId}/apply`
   (Use the matchId from Step 5)
2. Click "Send"
3. Verify `applied` field is now `true`

#### Step 8: Delete Match (Unlike)
1. Create new request: DELETE `http://localhost:5000/api/matches/{matchId}`
2. Click "Send"
3. Verify response: `{"message":"Match deleted"}`

#### Step 9: Verify Match is Deleted
1. Reuse request from Step 6: GET `http://localhost:5000/api/matches/user/test-user-123`
2. Click "Send"
3. Verify the match is no longer in the list

---

## Common Issues & Solutions

### Issue 1: "Could not get any response"
**Solution:** Make sure backend server is running on port 5000
```bash
cd backend
npm start
```

### Issue 2: "User not found" when creating match
**Solution:** Create the user first using POST `/api/users` endpoint

### Issue 3: "Already matched with this job"
**Solution:** This is expected behavior - you can't like the same job twice. Delete the existing match first or use a different jobId

### Issue 4: CORS errors
**Solution:** Server is configured to allow requests from localhost. Make sure you're using `http://localhost:5000` (not 127.0.0.1)

---

## Postman Collection Import (Optional)

You can create a Postman Collection with all these requests for easy testing. Save this JSON and import it into Postman:

File: `TINCLO_API_Collection.postman_collection.json` (see separate file)

---

## Quick Reference - All Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/jobs` | Get all jobs |
| GET | `/api/jobs/:id` | Get single job |
| POST | `/api/users` | Create user |
| GET | `/api/users/:userId` | Get user |
| POST | `/api/matches` | Create match (like) |
| GET | `/api/matches/user/:userId` | Get user matches |
| PUT | `/api/matches/:id/apply` | Mark as applied |
| DELETE | `/api/matches/:id` | Delete match (unlike) |

---

## Notes

- All POST/PUT requests require `Content-Type: application/json` header
- User must exist before creating matches (this was the bug we fixed!)
- Matches are automatically populated with job details
- Duplicate matches are prevented by unique index on (userId, jobId)

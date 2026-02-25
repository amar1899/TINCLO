# Job Swipe Matcher - Backend API

Express.js backend with MongoDB Atlas for the Job Swipe Matcher application.

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. MongoDB Atlas Setup

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string

### 3. Environment Variables

Create a `.env` file in the `server` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB connection string:

```
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/job-swipe-matcher?retryWrites=true&w=majority
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### 4. Seed Database

Add sample job postings to your database:

```bash
npm run seed
```

### 5. Start Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Jobs

- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create new job
- `DELETE /api/jobs/:id` - Delete job

### Matches

- `GET /api/matches/user/:userId` - Get user's matches
- `POST /api/matches` - Create match (like job)
- `PUT /api/matches/:id/apply` - Mark as applied
- `DELETE /api/matches/:id` - Delete match

### Health Check

- `GET /api/health` - Server status

## Testing with Postman

Import these requests into Postman:

### Get All Jobs
```
GET http://localhost:5000/api/jobs
```

### Create Match
```
POST http://localhost:5000/api/matches
Content-Type: application/json

{
  "userId": "user123",
  "jobId": "PASTE_JOB_ID_HERE"
}
```

### Get User Matches
```
GET http://localhost:5000/api/matches/user/user123
```

### Mark as Applied
```
PUT http://localhost:5000/api/matches/MATCH_ID_HERE/apply
```

## Project Structure

```
server/
├── models/
│   ├── Job.js          # Job schema
│   └── Match.js        # Match schema
├── routes/
│   ├── jobs.js         # Job endpoints
│   └── matches.js      # Match endpoints
├── scripts/
│   └── seedJobs.js     # Database seeding
├── .env                # Environment variables
├── server.js           # Main server file
└── package.json
```

# How to Verify Data is Stored in MongoDB Atlas

After you whitelist your IP and the backend connects successfully, here's how to verify that user signup data and other data is being stored in MongoDB Atlas.

## Step 1: Access MongoDB Atlas Dashboard

1. Go to https://cloud.mongodb.com
2. Log in with:
   - Username: `tinclo_amar`
   - Password: `Tinclo2026`

## Step 2: Browse Your Database Collections

1. Click on "Database" in the left sidebar
2. Find your cluster: **Cluster0**
3. Click the "Browse Collections" button

## Step 3: View Your Data

You should see your database: **job-swipe-matcher**

It contains three collections:

### 1. Users Collection
**What it stores**: User signup data

**How to view**:
- Click on "users" collection
- You'll see documents like this:

```json
{
  "_id": "user-john-1740528000000",
  "userId": "user-john-1740528000000",
  "email": "john@example.com",
  "password": "hashed_password_here",
  "name": "John Doe",
  "createdAt": "2026-02-26T10:30:00.000Z"
}
```

**What to check**:
- Each signup creates a new document
- userId format: `user-{email-prefix}-{timestamp}`
- Email and name are stored
- Password is stored (should be hashed in production)
- createdAt shows when they signed up

### 2. Jobs Collection
**What it stores**: Available job listings

**How to view**:
- Click on "jobs" collection
- You'll see job documents like this:

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Senior Software Engineer",
  "company": "Tech Corp",
  "description": "We are looking for...",
  "salary": "$120k - $150k",
  "location": "San Francisco, CA"
}
```

**What to check**:
- These are the jobs shown in the app
- You can add/edit jobs here manually
- Changes appear in the app immediately

### 3. Matches Collection
**What it stores**: User's liked jobs and application status

**How to view**:
- Click on "matches" collection
- You'll see match documents like this:

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "user-john-1740528000000",
  "jobId": "507f1f77bcf86cd799439011",
  "matchedAt": "2026-02-26T10:35:00.000Z",
  "applied": false
}
```

**What to check**:
- Each liked job creates a new match
- userId links to the user who liked it
- jobId links to the job that was liked
- applied: false means not applied yet
- applied: true means user clicked "Apply"

## Step 4: Test Data Flow

### Test 1: Signup
1. Go to http://localhost:5174/signup
2. Create a new account with:
   - Name: Test User
   - Email: test@example.com
   - Password: Test123!
3. Click "Sign Up"
4. Go to MongoDB Atlas → Browse Collections → users
5. **You should see a new document** with email "test@example.com"

### Test 2: Like a Job
1. Log in to the app
2. Browse jobs and click the heart (❤️) button
3. Go to MongoDB Atlas → Browse Collections → matches
4. **You should see a new match document** with your userId and the jobId

### Test 3: Apply for a Job
1. Go to "Matches" view in the app
2. Click "Apply" on a saved job
3. Go to MongoDB Atlas → Browse Collections → matches
4. Find the match document
5. **The "applied" field should be true**

## What You Should See

### Before Whitelisting IP
- Collections exist but may be empty or have old data
- New signups don't appear
- Liked jobs don't appear
- Applied status doesn't update

### After Whitelisting IP
- New signups immediately appear in "users" collection
- Liked jobs immediately appear in "matches" collection
- Applied status immediately updates in "matches" collection
- All data persists even after browser refresh

## Troubleshooting

### "I don't see my data"
1. Make sure backend is connected (check terminal for ✅ message)
2. Refresh the MongoDB Atlas page
3. Check you're looking at the right database: "job-swipe-matcher"
4. Check you're looking at the right collection: "users", "jobs", or "matches"

### "Collections are empty"
1. Make sure you've performed actions in the app (signup, like, apply)
2. Check browser console for errors (F12 → Console tab)
3. Check backend terminal for error messages
4. Verify backend is running on http://localhost:5002

### "I see old data but not new data"
1. Check that backend is using the standard MongoDB connection (not SQL interface)
2. Verify in `backend/.env` that MONGODB_URI starts with `mongodb+srv://`
3. Restart the backend server
4. Try the action again in the app

## Security Note

Currently, only you (the developer) can access this database because:
1. You need MongoDB Atlas login credentials
2. Your IP must be whitelisted
3. The connection string is in `backend/.env` (not public)

Regular users of your app:
- Cannot access MongoDB Atlas dashboard
- Cannot see other users' data
- Can only access their own data through the app
- Their data is protected by the backend API

## Data Privacy

The database stores:
- User emails and passwords (should be hashed)
- User names
- Which jobs each user liked
- Which jobs each user applied to

This data is:
- Only accessible to developers/testers with MongoDB Atlas access
- Protected by IP whitelist
- Protected by username/password authentication
- Not visible to other users of the app

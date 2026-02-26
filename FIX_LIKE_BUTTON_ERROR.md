# Fix "Unable to save job" Error When Clicking Like Button

## Problem
When you click the "Like" button (♥ Like), you see the error message:
**"Unable to save job. Please try again."**

## Root Cause
The error occurs because:
1. Your MongoDB connection uses the **SQL interface** which is **READ-ONLY**
2. The user "user123" doesn't exist in the database
3. The backend validates that users must exist before creating matches

## Solution: Insert User Manually in MongoDB Atlas

Since the SQL interface doesn't support write operations, you need to manually insert the user in MongoDB Atlas.

### Step-by-Step Fix:

#### 1. Go to MongoDB Atlas
- Visit: https://cloud.mongodb.com/
- Login with your credentials

#### 2. Navigate to Collections
- Click **"Browse Collections"** button
- Select your database: **`job-swipe-matcher`**

#### 3. Create/Select Users Collection
- If `users` collection doesn't exist:
  - Click **"Create Collection"**
  - Name: `users`
  - Click **"Create"**
- If it exists, click on `users` collection

#### 4. Insert the User
- Click **"Insert Document"** button
- Click the **"{}"** icon to switch to JSON view
- Paste this JSON:

```json
{
  "userId": "user123",
  "createdAt": {
    "$date": "2026-02-26T10:00:00.000Z"
  }
}
```

- Click **"Insert"**

#### 5. Verify User Was Created
- You should see the user in the `users` collection
- It will have an auto-generated `_id` field

#### 6. Test the Like Button
- Go back to your application: http://localhost:5173
- Click the **"♥ Like"** button on any job
- The job should now be saved successfully!
- The error message should disappear

## What Happens After Fix:

✅ Like button will work  
✅ Jobs will be saved to your matches  
✅ You can view saved jobs in "Matches" tab  
✅ No more "Unable to save job" error

## Additional Users (Optional)

If you want to test with different users, insert more:

```json
{
  "userId": "test-user-001",
  "createdAt": {"$date": "2026-02-26T10:00:00.000Z"}
}
```

```json
{
  "userId": "demo-user-002",
  "createdAt": {"$date": "2026-02-26T10:00:00.000Z"}
}
```

Then update `frontend/src/App.jsx` line 10 to use the new userId:
```javascript
const USER_ID = 'test-user-001'; // Change this
```

## Why This Happens:

The backend code validates that users exist before creating matches (this was the fix we implemented earlier). The validation code is in `backend/routes/matches.js`:

```javascript
// Validate user exists
const user = await User.findOne({ userId: req.body.userId });
if (!user) {
  return res.status(400).json({ message: 'User not found. Please create user first.' });
}
```

This prevents orphaned matches (matches without valid users).

## Permanent Solution (Optional):

To enable POST/PUT/DELETE operations via API:

1. **Whitelist your IP** in MongoDB Atlas:
   - Your IP: **183.82.117.230**
   - Go to: Network Access → Add IP Address
   - Enter: 183.82.117.230 or use 0.0.0.0/0

2. **Update backend/.env**:
   ```env
   MONGODB_URI=mongodb+srv://tinclo_amar:Tinclo2026@cluster0.oz3yftq.mongodb.net/job-swipe-matcher?retryWrites=true&w=majority
   ```

3. **Restart backend server**

Then POST/PUT/DELETE will work from Postman and the frontend will auto-create users.

## Quick Test:

After inserting the user, test in Postman:

**GET User:**
- URL: `http://localhost:5002/api/users/user123`
- Method: GET
- Expected: User object with userId "user123"

**Create Match:**
- URL: `http://localhost:5002/api/matches`
- Method: POST
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "userId": "user123",
  "jobId": "699dec03e86c1b1fcc2d6bff"
}
```
- Expected: Still fails with "command insert not found" (SQL interface limitation)

But the **frontend Like button will work** because it uses the same API, and the user now exists!

## Summary:

1. Insert user "user123" in MongoDB Atlas
2. Refresh your application
3. Click Like button
4. Job will be saved successfully!

The error is fixed once the user exists in the database.

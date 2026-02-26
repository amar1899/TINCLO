# MongoDB Atlas Setup Guide - Enable Write Operations

## Problem
You're currently using the SQL interface connection which is **READ-ONLY**. To perform CREATE, UPDATE, and DELETE operations, you need to use the standard MongoDB connection and whitelist your IP address.

## Solution: Whitelist Your IP Address

### Step 1: Login to MongoDB Atlas
1. Go to https://cloud.mongodb.com/
2. Login with your credentials:
   - Username: `tinclo_amar` (or your email)
   - Password: Your MongoDB Atlas password

### Step 2: Navigate to Network Access
1. In the left sidebar, click on **"Network Access"** (under Security section)
2. You'll see a list of IP addresses that are allowed to connect

### Step 3: Add Your IP Address

**Option A: Add Current IP (Recommended for Development)**
1. Click the **"Add IP Address"** button
2. Click **"Add Current IP Address"**
3. MongoDB will automatically detect your current IP
4. Add a comment like "My Development Machine"
5. Click **"Confirm"**

**Option B: Allow Access from Anywhere (Less Secure)**
1. Click the **"Add IP Address"** button
2. Click **"Allow Access from Anywhere"**
3. This adds `0.0.0.0/0` which allows all IPs
4. Add a comment like "Development - All IPs"
5. Click **"Confirm"**

### Step 4: Wait for Changes to Apply
- It may take 1-2 minutes for the changes to propagate
- You'll see a green "Active" status when ready

### Step 5: Update Your .env File
The `.env` file should use the standard MongoDB connection (not SQL interface):

```env
# Use this connection string (OPTION 1)
MONGODB_URI=mongodb+srv://tinclo_amar:Tinclo2026@cluster0.oz3yftq.mongodb.net/job-swipe-matcher?retryWrites=true&w=majority

# NOT this one (OPTION 2 - SQL Interface is read-only)
# MONGODB_URI=mongodb://tinclo_amar:Tinclo2026@atlas-sql-6999570cd1aa7a7e8f585a24-ifud0x.a.query.mongodb.net/job-swipe-matcher?ssl=true&authSource=admin&retryWrites=true&w=majority
```

### Step 6: Restart Your Server
```bash
cd backend
npm start
```

### Step 7: Seed Users
Once the server is running with the standard connection:
```bash
npm run seed:users
```

## Alternative: Manually Insert Users via MongoDB Atlas UI

If you can't whitelist your IP right now, you can manually insert users through the MongoDB Atlas web interface:

### Step 1: Go to Collections
1. In MongoDB Atlas, click on **"Browse Collections"**
2. Select your database: `job-swipe-matcher`
3. Find or create the `users` collection

### Step 2: Insert Documents
1. Click **"Insert Document"**
2. Switch to **"JSON View"** (toggle at the top)
3. Paste this JSON:

```json
{
  "userId": "john-doe-123",
  "createdAt": {"$date": "2026-02-26T10:00:00.000Z"}
}
```

4. Click **"Insert"**
5. Repeat for more users:

```json
{
  "userId": "jane-smith-456",
  "createdAt": {"$date": "2026-02-26T10:00:00.000Z"}
}
```

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

```json
{
  "userId": "amar-user-003",
  "createdAt": {"$date": "2026-02-26T10:00:00.000Z"}
}
```

## Verify Users Were Inserted

### Option 1: Via API (if server is running)
```bash
curl http://localhost:5001/api/users
```

### Option 2: Via Postman
- Method: GET
- URL: `http://localhost:5001/api/users`

### Option 3: Via MongoDB Atlas UI
- Go to "Browse Collections"
- Select `job-swipe-matcher` database
- Click on `users` collection
- You should see all inserted users

## Test CRUD Operations

Once users are inserted, test these in Postman:

### 1. Get All Users
- GET `http://localhost:5001/api/users`

### 2. Get Single User
- GET `http://localhost:5001/api/users/john-doe-123`

### 3. Create Match (Like a Job)
- POST `http://localhost:5001/api/matches`
- Body:
```json
{
  "userId": "john-doe-123",
  "jobId": "699dec03e86c1b1fcc2d6bff"
}
```

### 4. Get User Matches
- GET `http://localhost:5001/api/matches/user/john-doe-123`

## Summary

**Current Issue:** SQL interface connection is read-only  
**Solution:** Whitelist your IP in MongoDB Atlas Network Access  
**Alternative:** Manually insert users via MongoDB Atlas UI  
**Result:** All CRUD operations will work once IP is whitelisted

## Need Help?

If you're having trouble whitelisting your IP, you can:
1. Use the MongoDB Atlas UI to manually insert users (see above)
2. Contact MongoDB Atlas support
3. Check your MongoDB Atlas account permissions

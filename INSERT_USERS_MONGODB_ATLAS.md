# How to Manually Insert Users in MongoDB Atlas

Since POST/PUT/DELETE require write access and there are connection issues, you can manually insert users directly in MongoDB Atlas web interface.

## Step-by-Step Instructions

### 1. Login to MongoDB Atlas
- Go to: https://cloud.mongodb.com/
- Login with your credentials

### 2. Navigate to Your Database
- Click on **"Browse Collections"** button
- Select database: **`job-swipe-matcher`**

### 3. Create or Select Users Collection
- If `users` collection doesn't exist, click **"Create Collection"**
  - Collection name: `users`
  - Click **"Create"**
- If it exists, click on the `users` collection

### 4. Insert User Documents

Click **"Insert Document"** button, then click the **"{}"** icon to switch to JSON view.

#### User 1:
```json
{
  "userId": "john-doe-123",
  "createdAt": {
    "$date": "2026-02-26T10:00:00.000Z"
  }
}
```
Click **"Insert"**

#### User 2:
```json
{
  "userId": "jane-smith-456",
  "createdAt": {
    "$date": "2026-02-26T10:05:00.000Z"
  }
}
```
Click **"Insert"**

#### User 3:
```json
{
  "userId": "mike-wilson-789",
  "createdAt": {
    "$date": "2026-02-26T10:10:00.000Z"
  }
}
```
Click **"Insert"**

#### User 4:
```json
{
  "userId": "sarah-johnson-101",
  "createdAt": {
    "$date": "2026-02-26T10:15:00.000Z"
  }
}
```
Click **"Insert"**

#### User 5:
```json
{
  "userId": "test-user-001",
  "createdAt": {
    "$date": "2026-02-26T10:20:00.000Z"
  }
}
```
Click **"Insert"**

#### User 6:
```json
{
  "userId": "demo-user-002",
  "createdAt": {
    "$date": "2026-02-26T10:25:00.000Z"
  }
}
```
Click **"Insert"**

#### User 7:
```json
{
  "userId": "amar-user-003",
  "createdAt": {
    "$date": "2026-02-26T10:30:00.000Z"
  }
}
```
Click **"Insert"**

### 5. Verify Users Were Inserted
- You should see all 7 users in the `users` collection
- Each user will have an auto-generated `_id` field

## Test in Postman

Once users are inserted, restart your backend server and test these endpoints:

### GET All Users
- **Method:** GET
- **URL:** `http://localhost:5001/api/users`
- **Expected:** Array of all 7 users

### GET Single User
- **Method:** GET
- **URL:** `http://localhost:5001/api/users/john-doe-123`
- **Expected:** Single user object

### GET User Matches
- **Method:** GET
- **URL:** `http://localhost:5001/api/matches/user/john-doe-123`
- **Expected:** Array of matches for this user

## For POST/PUT/DELETE Operations

To enable POST, PUT, and DELETE operations, you need to:

1. **Whitelist your IP** in MongoDB Atlas:
   - Your IP: **183.82.117.230**
   - Go to: Network Access → Add IP Address
   - Enter: 183.82.117.230 or use 0.0.0.0/0 for all IPs

2. **Wait 2-3 minutes** for DNS propagation

3. **Update .env** to use standard connection:
   ```
   MONGODB_URI=mongodb+srv://tinclo_amar:Tinclo2026@cluster0.oz3yftq.mongodb.net/job-swipe-matcher?retryWrites=true&w=majority
   ```

4. **Restart server**

## Alternative: Update/Delete via MongoDB Atlas UI

You can also UPDATE and DELETE users directly in MongoDB Atlas:

### Update a User:
1. Find the user in the collection
2. Click the pencil icon (Edit)
3. Modify the `userId` field
4. Click **"Update"**

### Delete a User:
1. Find the user in the collection
2. Click the trash icon (Delete)
3. Confirm deletion

## Summary

- ✅ **READ operations** work with SQL interface (current setup)
- ❌ **WRITE operations** (POST/PUT/DELETE) require standard MongoDB connection
- 🔧 **Workaround:** Manually insert/update/delete via MongoDB Atlas UI
- 🎯 **Permanent fix:** Whitelist IP and use standard connection string

Once users are inserted manually, you can test all GET endpoints and the match creation will work!

# Fix MongoDB Connection Issue

## Current Problem
Your application shows "Unable to load your saved jobs" because the backend server cannot connect to MongoDB Atlas.

## Root Cause
Your IP address has changed to **152.57.144.113** and this IP is not whitelisted in MongoDB Atlas Network Access settings.

## Solution: Whitelist Your IP Address

### Step 1: Go to MongoDB Atlas
1. Open your browser and go to https://cloud.mongodb.com
2. Log in with your credentials:
   - Username: `tinclo_amar`
   - Password: `Tinclo2026`

### Step 2: Navigate to Network Access
1. Click on "Network Access" in the left sidebar (under "Security")
2. You'll see a list of whitelisted IP addresses

### Step 3: Add Your Current IP
1. Click the "ADD IP ADDRESS" button
2. You have two options:

   **Option A: Add Current IP (Recommended for now)**
   - Click "ADD CURRENT IP ADDRESS"
   - It will auto-detect your IP: 152.57.144.113
   - Add a comment: "Home IP - Feb 2026"
   - Click "Confirm"

   **Option B: Allow Access from Anywhere (NOT RECOMMENDED for production)**
   - Click "ALLOW ACCESS FROM ANYWHERE"
   - This adds 0.0.0.0/0 which allows any IP
   - Only use this for testing, NOT for production
   - Click "Confirm"

### Step 4: Wait for Changes to Apply
- MongoDB Atlas takes 1-2 minutes to apply the changes
- You'll see a status indicator showing "Pending" then "Active"

### Step 5: Restart Backend Server
After the IP is whitelisted and active:

1. The backend server will automatically try to reconnect
2. You should see in the terminal:
   ```
   ✅ Connected to MongoDB Atlas
   🚀 Server running on http://localhost:5002
   ```

### Step 6: Refresh Your Application
1. Go to your browser at http://localhost:5173
2. Press **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (Mac) for hard refresh
3. The app should now load successfully

## What Happens After This Fix

Once connected to MongoDB Atlas with the standard connection:

1. **Signup data will be stored in MongoDB** - When users sign up, their data goes to the database
2. **Like button will work** - Saved jobs will be stored in MongoDB
3. **Apply button will work** - Application status will be saved in MongoDB
4. **Data persists** - All data is stored in the cloud, not just localStorage

## Important Notes

### IP Address Changes
Your IP address may change if:
- You restart your router
- Your ISP assigns a new IP
- You connect from a different network

When this happens, you'll need to whitelist the new IP again.

### Check Your Current IP
To check your current IP address, run this command in PowerShell:
```powershell
Invoke-RestMethod -Uri https://api.ipify.org
```

### For Development
If your IP changes frequently, you can:
1. Use "Allow Access from Anywhere" (0.0.0.0/0) during development
2. Remember to restrict this before deploying to production
3. Or use MongoDB Atlas's "Add Current IP" feature each time your IP changes

## Troubleshooting

### If Backend Still Won't Start
1. Check that you whitelisted the correct IP: 152.57.144.113
2. Wait 2-3 minutes for MongoDB Atlas to apply changes
3. Check the backend terminal for error messages
4. Verify your MongoDB credentials are correct in `backend/.env`

### If You See "querySrv ECONNREFUSED"
This means DNS resolution is failing. Try:
1. Check your internet connection
2. Try using a different DNS server (Google DNS: 8.8.8.8)
3. Restart your router

### If You See "Authentication Failed"
Your MongoDB credentials might be incorrect. Check:
1. Username: `tinclo_amar`
2. Password: `Tinclo2026`
3. Make sure there are no extra spaces in the connection string

## Current Status

- **Current IP**: 152.57.144.113
- **Backend Status**: Not running (waiting for IP whitelist)
- **Frontend Status**: Can start but will show error without backend
- **Connection Type**: Standard MongoDB (read/write enabled)

## Next Steps

1. Whitelist IP 152.57.144.113 in MongoDB Atlas
2. Wait for changes to apply (1-2 minutes)
3. Backend will automatically connect
4. Refresh your browser
5. Test signup, like, and apply features

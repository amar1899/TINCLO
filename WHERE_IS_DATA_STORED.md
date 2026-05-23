# Where is Your Data Stored?

## Overview

TINCLO currently stores data in **three places**:

1. **Browser LocalStorage** (User accounts, current session)
2. **App State** (Liked jobs, matches, apply status - in memory)
3. **MongoDB Atlas** (Read-only access - jobs data only)

---

## 1. Browser LocalStorage

### What's Stored:
- **User Accounts** (signup data - name, email, password, userId)
- **Current Logged-in User** (session info)

### Location:
Your browser's localStorage at `http://localhost:5173`

### Important Notes:
- ⚠️ **User signup data is ONLY stored in localStorage** (not in MongoDB yet)
- This is temporary until MongoDB write access is configured
- Data persists across browser sessions but is local to your browser
- If you clear browser data, all user accounts will be lost

### How to View:

#### Method 1: Browser DevTools
1. Press `F12` to open DevTools
2. Go to **"Application"** tab (Chrome) or **"Storage"** tab (Firefox)
3. Expand **"Local Storage"**
4. Click on `http://localhost:5173`
5. Look for these keys:
   - `tinclo_users` - All registered users
   - `tinclo_current_user` - Currently logged in user

#### Method 2: Console Commands
Open console (F12) and run:

```javascript
// View all registered users
console.log('All Users:', JSON.parse(localStorage.getItem('tinclo_users') || '[]'));

// View current logged-in user
console.log('Current User:', JSON.parse(localStorage.getItem('tinclo_current_user') || 'null'));

// View specific user data
const users = JSON.parse(localStorage.getItem('tinclo_users') || '[]');
console.table(users);
```

### Data Structure:

#### All Users (`tinclo_users`):
```json
[
  {
    "id": "user-1709123456789",
    "name": "John Doe",
    "email": "john@example.com",
    "password": "test123",
    "createdAt": "2026-02-26T10:00:00.000Z"
  },
  {
    "id": "user-1709123456790",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "test456",
    "createdAt": "2026-02-26T10:05:00.000Z"
  }
]
```

#### Current User (`tinclo_current_user`):
```json
{
  "id": "user-1709123456789",
  "name": "John Doe",
  "email": "john@example.com"
}
```

---

## 2. App State (In-Memory)

### What's Stored:
- **Liked Jobs** (your matches)
- **Apply Status** (which jobs you've applied to)
- **Current Job Index** (which job you're viewing)

### Location:
Stored in React state via `StateManager` class

### Persistence:
- ✅ Persists during browser session
- ✅ Survives page refresh (reloaded from API/localStorage)
- ❌ Lost when you close the browser tab (unless saved to localStorage)
- ⚠️ **Apply status is ONLY stored in app state** (not in MongoDB yet)

### Important Notes:
- When you click "Like" on a job, it's saved to app state immediately
- When you click "Apply", it updates the app state immediately
- The app tries to sync with MongoDB, but currently fails due to read-only connection
- Your liked jobs and apply status persist in the browser session only

### Data Structure:

```javascript
{
  currentView: 'browser',  // or 'matches'
  currentJobIndex: 0,
  matches: [
    {
      id: 'local-1709123456789',
      job: {
        id: '699dec03e86c1b1fcc2d6bff',
        title: 'Product Manager',
        company: 'ProductCo',
        description: '...',
        salary: '$120k - $160k',
        location: 'Boston, MA'
      },
      matchedAt: '2026-02-26T10:00:00.000Z',
      applied: false  // or true after clicking Apply
    }
  ],
  jobs: [ /* all available jobs */ ]
}
```

---

## 3. MongoDB Atlas (Read-Only)

### What's Stored:
- **Job Listings** (all available jobs)
- ⚠️ **User data, matches, and apply status are NOT stored here yet**

### Location:
MongoDB Atlas cloud database at `cluster0.oz3yftq.mongodb.net`

### Current Status:
- ✅ Can READ job listings from database
- ❌ Cannot WRITE user signups (read-only SQL interface)
- ❌ Cannot WRITE matches/likes (read-only SQL interface)
- ❌ Cannot UPDATE apply status (read-only SQL interface)

### Why Read-Only?
The current MongoDB connection uses the SQL interface which only supports read operations. To enable write operations:
1. Whitelist your IP address in MongoDB Atlas Network Access
2. Switch to standard MongoDB connection string
3. Restart the backend server

### Connection String (in `backend/.env`):
```
# Currently using (read-only):
MONGODB_URI=mongodb://tinclo_amar:...@atlas-sql-...

# Need to switch to (read-write):
# MONGODB_URI=mongodb+srv://tinclo_amar:...@cluster0.oz3yftq.mongodb.net/...
```

---

## How to View Your Data

### View Signup Data:

1. Open browser console (F12)
2. Run:
```javascript
// See all users who signed up
const users = JSON.parse(localStorage.getItem('tinclo_users') || '[]');
console.log('Total Users:', users.length);
users.forEach((user, index) => {
  console.log(`User ${index + 1}:`, {
    name: user.name,
    email: user.email,
    id: user.id,
    signedUpAt: user.createdAt
  });
});
```

### View Current User:

```javascript
const currentUser = JSON.parse(localStorage.getItem('tinclo_current_user'));
console.log('Logged in as:', currentUser);
```

### View Your Liked Jobs:

```javascript
// This is in app state, not localStorage
// You can see it in React DevTools or check the Matches tab in the UI
```

---

## Data Persistence

### ✅ What Persists:
- User accounts (localStorage)
- Current logged-in user (localStorage)
- Liked jobs (app state, reloaded on page load)
- Apply status (app state)

### ❌ What Doesn't Persist:
- Nothing! Everything is saved locally

### 🔄 When Data is Lost:
- When you clear browser data/cache
- When you clear localStorage manually
- When you use incognito/private mode (separate storage)

---

## Clear Your Data

### Clear All Data:
```javascript
localStorage.removeItem('tinclo_users');
localStorage.removeItem('tinclo_current_user');
location.reload();
```

### Clear Only Current User (Logout):
```javascript
localStorage.removeItem('tinclo_current_user');
location.reload();
```

### Clear Specific User:
```javascript
const users = JSON.parse(localStorage.getItem('tinclo_users') || '[]');
const filteredUsers = users.filter(u => u.email !== 'john@example.com');
localStorage.setItem('tinclo_users', JSON.stringify(filteredUsers));
console.log('User removed');
```

---

## Export Your Data

### Export All Users:
```javascript
const users = JSON.parse(localStorage.getItem('tinclo_users') || '[]');
const dataStr = JSON.stringify(users, null, 2);
const dataBlob = new Blob([dataStr], {type: 'application/json'});
const url = URL.createObjectURL(dataBlob);
const link = document.createElement('a');
link.href = url;
link.download = 'tinclo-users.json';
link.click();
```

### Import Users:
```javascript
// Paste your JSON data here
const importedUsers = [
  {
    "id": "user-123",
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123",
    "createdAt": "2026-02-26T10:00:00.000Z"
  }
];
localStorage.setItem('tinclo_users', JSON.stringify(importedUsers));
console.log('Users imported');
```

---

## Summary

| Data Type | Storage Location | Persists? | Viewable? | MongoDB? |
|-----------|-----------------|-----------|-----------|----------|
| User Accounts | localStorage | ✅ Yes | ✅ Yes (DevTools) | ❌ No (read-only) |
| Current User | localStorage | ✅ Yes | ✅ Yes (DevTools) | ❌ No |
| Liked Jobs | App State | ✅ Yes | ✅ Yes (UI/Console) | ❌ No (read-only) |
| Apply Status | App State | ✅ Yes | ✅ Yes (UI) | ❌ No (read-only) |
| Job Listings | MongoDB Atlas | ✅ Yes | ✅ Yes (UI) | ✅ Yes (read-only) |

### Current Limitations:
- User signup data is stored in localStorage only (not in MongoDB)
- Liked jobs are stored in app state only (not in MongoDB)
- Apply status is stored in app state only (not in MongoDB)
- To save data to MongoDB, you need to enable write access (see section 3 above)

---

## Troubleshooting

### "I signed up but can't see my account"
**Check:**
```javascript
const users = JSON.parse(localStorage.getItem('tinclo_users') || '[]');
console.log('Found users:', users.length);
console.log(users);
```

### "My liked jobs disappeared"
**Check:**
```javascript
const currentUser = JSON.parse(localStorage.getItem('tinclo_current_user'));
console.log('Current user:', currentUser);
// If null, you're not logged in
```

### "Apply button doesn't work"
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Check console for errors (F12)
3. Make sure you're logged in

---

## Future: Database Storage

When MongoDB write access is enabled (by whitelisting your IP and switching connection strings):
- User accounts → MongoDB `users` collection ✅
- Liked jobs → MongoDB `matches` collection ✅
- Apply status → MongoDB `matches.applied` field ✅

For now, localStorage and app state work perfectly for development and testing!

### How to Enable MongoDB Write Access:

1. **Whitelist Your IP in MongoDB Atlas:**
   - Go to MongoDB Atlas dashboard
   - Navigate to Network Access
   - Click "Add IP Address"
   - Add your current IP: `183.82.117.230`
   - Or add `0.0.0.0/0` for all IPs (less secure, for testing only)

2. **Update `backend/.env`:**
   ```bash
   # Comment out the SQL interface line:
   # MONGODB_URI=mongodb://tinclo_amar:...@atlas-sql-...
   
   # Uncomment the standard connection line:
   MONGODB_URI=mongodb+srv://tinclo_amar:Tinclo2026@cluster0.oz3yftq.mongodb.net/job-swipe-matcher?retryWrites=true&w=majority
   ```

3. **Restart Backend Server:**
   ```bash
   cd backend
   npm start
   ```

4. **Test Write Operations:**
   - Try signing up a new user
   - Try liking a job
   - Try clicking Apply
   - Check MongoDB Atlas dashboard to see if data appears

Once this is done, all data will be saved to MongoDB Atlas automatically!

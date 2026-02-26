# How to Sign Up and Use TINCLO

## For New Users

### Step 1: Access the Application
1. Open your browser and go to: **http://localhost:5173**
2. You'll see the TINCLO landing page

### Step 2: Create an Account
1. Click the **"Sign Up"** button in the navigation or **"Create Account"** button
2. You'll be redirected to the signup page
3. Fill in the form:
   - **Full Name**: Your name (e.g., "John Doe")
   - **Email Address**: Your email (e.g., "john@example.com")
   - **Password**: At least 6 characters (e.g., "mypassword123")
4. Click **"Sign Up"** button
5. If successful, you'll see "Account created successfully!" message
6. You'll be automatically redirected to the jobs page

### Step 3: Browse Jobs
1. After signup, you'll see the job browser with available positions
2. Each job card shows:
   - Job title
   - Company name
   - Location
   - Salary range
   - Job description

### Step 4: Like Jobs (Swipe Right)
1. Click the **"♥ Like"** button (green) to save a job
2. The job will be added to your matches
3. You'll automatically move to the next job

### Step 5: Skip Jobs (Swipe Left)
1. Click the **"✕ Dislike"** button (red) to skip a job
2. You'll move to the next job without saving

### Step 6: View Your Matches
1. Click **"Matches"** in the navigation bar
2. You'll see all jobs you've liked
3. Each match shows:
   - Job details
   - When you matched with it
   - Apply button

### Step 7: Mark Jobs as Applied
1. In the Matches view, click the **"Apply"** button on any job
2. The button will change to show "Applied" status
3. This helps you track which jobs you've already applied to

## How Authentication Works

### Current Implementation (Local Storage)
- User accounts are stored in your browser's local storage
- Each user gets a unique ID (e.g., "user-1234567890")
- Your liked jobs and application status are saved locally
- Data persists across browser sessions (until you clear browser data)

### User Data Storage
- **Users**: Stored in `localStorage` under key `tinclo_users`
- **Current User**: Stored in `localStorage` under key `tinclo_current_user`
- **Matches**: Saved in the app state and synced with backend (when available)

## Features

### ✅ Working Features:
1. **Sign Up**: Create new account with name, email, password
2. **Browse Jobs**: View all available job listings
3. **Like Jobs**: Save jobs to your matches
4. **Skip Jobs**: Move to next job without saving
5. **View Matches**: See all jobs you've liked
6. **Mark as Applied**: Track which jobs you've applied to
7. **Persistent Data**: Your data is saved in browser storage

### 🔄 How It Works:
- When you sign up, your account is created locally
- Each user gets a unique ID
- When you like a job, it's saved with your user ID
- Your matches are stored locally and work offline
- No server authentication required (perfect for demo/development)

## Testing the Signup Flow

### Test User 1:
- Name: John Doe
- Email: john@example.com
- Password: test123

### Test User 2:
- Name: Jane Smith
- Email: jane@example.com
- Password: test456

### Test User 3:
- Name: Mike Wilson
- Email: mike@example.com
- Password: test789

## Troubleshooting

### Issue: "An account with this email already exists"
**Solution**: You've already signed up with that email. Try a different email or clear your browser data.

### Issue: "All fields are required"
**Solution**: Make sure to fill in all three fields (name, email, password).

### Issue: "Password must be at least 6 characters"
**Solution**: Use a longer password (minimum 6 characters).

### Issue: "Please enter a valid email address"
**Solution**: Use a proper email format (e.g., user@example.com).

### Issue: Jobs not loading
**Solution**: 
1. Make sure backend server is running on port 5002
2. Check browser console for errors
3. Refresh the page

### Issue: Liked jobs not saving
**Solution**: 
1. Check browser console for errors
2. Make sure you're signed up and logged in
3. Try refreshing the page

## Clearing Your Data

If you want to start fresh:

1. Open browser console (F12)
2. Go to "Application" or "Storage" tab
3. Find "Local Storage" → "http://localhost:5173"
4. Delete these keys:
   - `tinclo_users`
   - `tinclo_current_user`
5. Refresh the page

Or run this in the console:
```javascript
localStorage.removeItem('tinclo_users');
localStorage.removeItem('tinclo_current_user');
location.reload();
```

## Navigation

- **Landing Page**: http://localhost:5173/
- **Sign Up**: http://localhost:5173/signup
- **Jobs Browser**: http://localhost:5173/jobs

## User Flow Diagram

```
Landing Page (/)
    ↓
Sign Up (/signup)
    ↓
Create Account
    ↓
Jobs Browser (/jobs)
    ↓
Like/Dislike Jobs
    ↓
View Matches
    ↓
Mark as Applied
```

## Summary

1. **Sign up** with name, email, and password
2. **Browse jobs** by swiping through listings
3. **Like jobs** to save them to your matches
4. **View matches** to see all saved jobs
5. **Mark as applied** to track your applications

Everything works locally in your browser - no complex backend authentication required!

## Future Enhancements

When you're ready to add full authentication:
1. Create backend auth routes (`/api/auth/signup`, `/api/auth/login`)
2. Use JWT tokens for session management
3. Store user data in MongoDB
4. Add password hashing (bcrypt)
5. Add email verification
6. Add password reset functionality

For now, the local storage approach works perfectly for development and testing!

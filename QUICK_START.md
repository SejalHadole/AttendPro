# Quick Start Guide

## Prerequisites
- Node.js and npm installed
- MongoDB installed and running
- Visual Studio Code (optional)

## Step-by-Step Setup

### 1. Start MongoDB
```powershell
# Open PowerShell and start MongoDB
# Default location (adjust if different)
mongod
```

### 2. Install Backend Dependencies
```powershell
cd backend
npm install
```

### 3. Start Backend Server
```powershell
# From backend directory
npm start
# or for development with auto-reload
npm run dev
```
Server will run on `http://localhost:5000`

### 4. Open Frontend
- Open `frontend/index.html` in a web browser
- Or use Live Server extension in VS Code

## Testing the Application

### Register a New User
1. Click "Register" on login page
2. Fill in:
   - Full Name: Your Name
   - Username: your_username
   - Password: your_password
   - Email: your@email.com
   - Role: Select "student" or "admin"
   - Class: Select a class (if student)
3. Click Register
4. **Data is now saved to MongoDB!** ✅

### Check Database (Using MongoDB Compass)
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Select `attendance_db` database
4. Check collections:
   - `users` - Contains registered users
   - `students` - Contains student records
   - `attendances` - Contains attendance records

### Admin Functions
1. Login with admin account
2. Go to "Add Attendance"
3. Select date, students, and mark their status
4. Click Save
5. **Attendance is saved to database!** ✅

### Student Functions
1. Login as student
2. View your attendance records
3. See your attendance rate

## Common Issues & Solutions

### Issue: "Cannot POST /api/auth/register"
**Solution:** Backend not running or routes not properly registered. Check:
- Backend is running on port 5000
- `server.js` has `app.use('/api/auth', authRoutes);`

### Issue: "MongoDB connection error"
**Solution:** MongoDB not running. Start it with:
```powershell
mongod
```

### Issue: Data not saving but no error
**Solution:** Check MongoDB is connected. Look at backend console for messages like:
- "MongoDB connected successfully" ✅
- If not present, restart backend after starting MongoDB

### Issue: Frontend can't connect to backend
**Solution:** Update API endpoint in `frontend/script.js` if needed:
```javascript
const API = 'http://localhost:5000/api'; // Change port if different
```

## Environment Variables (.env)

Located in `backend/.env`:
```
MONGO_URI=mongodb://localhost:27017/attendance_db
JWT_SECRET=your-secret-key-change-this-in-production
PORT=5000
```

Change `JWT_SECRET` for production!

## File Structure Overview

```
AttendPro/
├── backend/
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Student.js         # Student schema
│   │   └── Attendance.js      # Attendance schema
│   ├── routes/
│   │   └── auth.js            # Authentication routes
│   ├── server.js              # Main server file
│   ├── package.json
│   └── .env
├── frontend/
│   ├── index.html             # Main HTML
│   ├── script.js              # Frontend logic
│   └── style.css              # Styles
└── DATABASE_FIX_SUMMARY.md    # This file!
```

## Data Flow

**Registration:**
User fills form → Frontend sends POST → Backend validates → Creates User + Student in DB → Success message

**Attendance:**
Admin marks attendance → Frontend sends POST → Backend creates records → DB saves → Updated on UI

## Tips

✅ Always start MongoDB first
✅ Check browser console (F12) for frontend errors
✅ Check backend console for server errors
✅ Use MongoDB Compass to verify data is saved
✅ Restart backend if changes don't take effect

---

**All database saving issues have been fixed!** 🎉

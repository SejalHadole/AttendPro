# API Endpoints Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication Routes

### Register New User
**POST** `/auth/register`

Request Body:
```json
{
  "name": "John Doe",
  "username": "johndoe",
  "password": "password123",
  "email": "john@example.com",
  "role": "student",
  "class": "10A"
}
```

Response (Success):
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "role": "student"
  }
}
```

Response (Error):
```json
{
  "success": false,
  "message": "Username already exists"
}
```

### Login
**POST** `/auth/login`

Request Body:
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

Response (Success):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "username": "johndoe",
    "role": "student",
    "email": "john@example.com"
  }
}
```

---

## Student Routes

### Get All Students
**GET** `/students`

Headers:
```
Authorization: Bearer {token}
```

Response (Success):
```json
{
  "success": true,
  "students": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "username": "johndoe",
      "class": "10A",
      "contact": "9876543210",
      "attendanceRate": 85,
      "createdAt": "2024-11-15T10:30:00Z"
    }
  ]
}
```

### Add New Student
**POST** `/students`

Headers:
```
Authorization: Bearer {token}
```

Request Body:
```json
{
  "name": "Jane Smith",
  "username": "janesmith",
  "class": "10B",
  "contact": "9876543211"
}
```

Response (Success):
```json
{
  "success": true,
  "student": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Jane Smith",
    "username": "janesmith",
    "class": "10B",
    "contact": "9876543211",
    "attendanceRate": 0,
    "createdAt": "2024-11-15T10:35:00Z"
  }
}
```

### Update Student
**PUT** `/students/:id`

Headers:
```
Authorization: Bearer {token}
```

Request Body:
```json
{
  "name": "Jane Smith Updated",
  "username": "janesmith",
  "class": "10B",
  "contact": "9876543212"
}
```

### Delete Student
**DELETE** `/students/:id`

Headers:
```
Authorization: Bearer {token}
```

Response (Success):
```json
{
  "success": true,
  "message": "Student deleted successfully"
}
```

---

## Attendance Routes

### Get Attendance Records
**GET** `/attendance?date=2024-11-15&class=10A&studentId=507f1f77bcf86cd799439011`

Headers:
```
Authorization: Bearer {token}
```

Query Parameters (Optional):
- `date`: Filter by date (YYYY-MM-DD)
- `class`: Filter by class
- `studentId`: Filter by student ID

Response (Success):
```json
{
  "success": true,
  "attendance": [
    {
      "_id": "607f1f77bcf86cd799439013",
      "studentId": "507f1f77bcf86cd799439011",
      "studentName": "John Doe",
      "class": "10A",
      "date": "2024-11-15",
      "status": "present",
      "createdAt": "2024-11-15T10:40:00Z"
    }
  ]
}
```

### Mark Attendance
**POST** `/attendance`

Headers:
```
Authorization: Bearer {token}
```

Request Body:
```json
{
  "date": "2024-11-15",
  "class": "10A",
  "attendanceRecords": [
    {
      "studentId": "507f1f77bcf86cd799439011",
      "studentName": "John Doe",
      "status": "present"
    },
    {
      "studentId": "507f1f77bcf86cd799439012",
      "studentName": "Jane Smith",
      "status": "absent"
    }
  ]
}
```

Response (Success):
```json
{
  "success": true,
  "records": [
    {
      "_id": "607f1f77bcf86cd799439013",
      "studentId": "507f1f77bcf86cd799439011",
      "studentName": "John Doe",
      "class": "10A",
      "date": "2024-11-15",
      "status": "present",
      "createdAt": "2024-11-15T10:40:00Z"
    }
  ]
}
```

---

## Report Routes

### Get Monthly Report
**GET** `/reports/monthly?month=11&year=2024`

Headers:
```
Authorization: Bearer {token}
```

Query Parameters:
- `month`: Month (1-12)
- `year`: Year (YYYY)

Response (Success):
```json
{
  "success": true,
  "report": [
    {
      "student": "John Doe",
      "class": "10A",
      "present": 15,
      "absent": 2,
      "late": 1,
      "attendanceRate": 87
    }
  ]
}
```

---

## Error Responses

### Unauthorized (No Token)
Status: 401
```json
{
  "success": false,
  "message": "Access token required"
}
```

### Invalid Token
Status: 403
```json
{
  "success": false,
  "message": "Invalid token"
}
```

### Server Error
Status: 500
```json
{
  "success": false,
  "message": "Server error: [error details]"
}
```

---

## Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - No authentication token
- `403 Forbidden` - Invalid token
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Authentication Token

Token is returned on successful login and must be included in Authorization header for protected routes:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Token expires after 24 hours. Get a new token by logging in again.

---

## Status Values

For attendance records:
- `present` - Student was present
- `absent` - Student was absent
- `late` - Student arrived late

---

## Example cURL Requests

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "username": "johndoe",
    "password": "password123",
    "email": "john@example.com",
    "role": "student",
    "class": "10A"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "password123"
  }'
```

### Get Students (with token)
```bash
curl -X GET http://localhost:5000/api/students \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

**All endpoints now properly save data to MongoDB!** ✅

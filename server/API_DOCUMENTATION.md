# Student Record Database API Documentation

## Overview
This API provides a secure student record management system with admin-only access control and unique URL generation for accessing class records.

## Base URL
```
http://localhost:8090
```

## Authentication
The API uses session-based authentication. Admin users must login to access protected endpoints.

### Default Admin Credentials
```
Username: admin
Password: admin123
```
**⚠️ Important: Change these credentials in production!**

## API Endpoints

### 1. Root Endpoint
Get API information and available endpoints.

**Request:**
```
GET /
```

**Response:**
```json
{
  "message": "Student Record Database API",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

### 2. Admin Login
Authenticate as an admin user.

**Request:**
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response (Success):**
```json
{
  "message": "Login successful",
  "user": {
    "username": "admin",
    "role": "admin"
  }
}
```

**Response (Error):**
```json
{
  "error": "Invalid credentials"
}
```

### 3. Logout
End the admin session.

**Request:**
```
POST /api/auth/logout
```

**Response:**
```json
{
  "message": "Logout successful"
}
```

### 4. Generate Unique Class URL (Admin Only)
Generate a unique, secure URL to access student records for a specific class.

**Request:**
```
POST /api/students/class/:className/generate-url
```

**Example:**
```
POST /api/students/class/Grade%2010A/generate-url
```

**Response:**
```json
{
  "message": "Unique access URL generated successfully",
  "className": "Grade 10A",
  "accessUrl": "/api/students/class/Grade%2010A/550e8400-e29b-41d4-a716-446655440000",
  "fullUrl": "http://localhost:8090/api/students/class/Grade%2010A/550e8400-e29b-41d4-a716-446655440000",
  "expiresIn": "This token remains valid until a new one is generated for this class"
}
```

**Note:** This endpoint requires admin authentication. The generated URL can be shared with authorized personnel to access class records without admin login.

### 5. Get Students by Class (With Unique URL)
Access student records for a specific class using the unique URL token.

**Request:**
```
GET /api/students/class/:className/:uniqueId
```

**Example:**
```
GET /api/students/class/Grade%2010A/550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "className": "Grade 10A",
  "totalStudents": 2,
  "students": [
    {
      "id": 1,
      "name": "John Doe",
      "class": "Grade 10A",
      "age": 15,
      "studentId": "S001",
      "email": "john@example.com"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "class": "Grade 10A",
      "age": 16,
      "studentId": "S002",
      "email": "jane@example.com"
    }
  ]
}
```

**Error Response:**
```json
{
  "error": "Invalid or expired access token for this class."
}
```

### 6. Get All Students (Admin Only)
Retrieve all student records.

**Request:**
```
GET /api/students
```

**Response:**
```json
{
  "totalStudents": 5,
  "students": [ ... ]
}
```

### 7. Get Single Student (Admin Only)
Get details of a specific student by ID.

**Request:**
```
GET /api/students/:id
```

**Example:**
```
GET /api/students/1
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "class": "Grade 10A",
  "age": 15,
  "studentId": "S001",
  "email": "john@example.com"
}
```

### 8. Add New Student (Admin Only)
Add a new student to the database.

**Request:**
```
POST /api/students
Content-Type: application/json

{
  "name": "New Student",
  "class": "Grade 10A",
  "age": 15,
  "studentId": "S006",
  "email": "newstudent@example.com"
}
```

**Response:**
```json
{
  "message": "Student added successfully",
  "student": {
    "id": 6,
    "name": "New Student",
    "class": "Grade 10A",
    "age": 15,
    "studentId": "S006",
    "email": "newstudent@example.com"
  }
}
```

### 9. Get All Classes (Admin Only)
Get a list of all classes with student counts.

**Request:**
```
GET /api/classes
```

**Response:**
```json
{
  "totalClasses": 3,
  "classes": [
    {
      "className": "Grade 10A",
      "studentCount": 2
    },
    {
      "className": "Grade 10B",
      "studentCount": 1
    },
    {
      "className": "Grade 11A",
      "studentCount": 2
    }
  ]
}
```

## Error Responses

### 401 Unauthorized
Returned when trying to access admin-only endpoints without authentication.
```json
{
  "error": "Unauthorized. Admin access required."
}
```

### 403 Forbidden
Returned when using an invalid or expired unique access token.
```json
{
  "error": "Invalid or expired access token for this class."
}
```

### 404 Not Found
Returned when requested resource doesn't exist.
```json
{
  "error": "Student not found"
}
```

### 400 Bad Request
Returned when request validation fails.
```json
{
  "errors": [
    {
      "msg": "Invalid value",
      "param": "email",
      "location": "body"
    }
  ]
}
```

## Security Features

1. **Admin-Only Access**: Most endpoints require admin authentication
2. **Unique URL Tokens**: Class records can be accessed via unique, hard-to-guess URLs
3. **Session Management**: Secure session-based authentication
4. **Input Validation**: All inputs are validated using express-validator
5. **Password Hashing**: Admin passwords are hashed using bcryptjs
6. **CORS Protection**: Cross-origin requests are controlled
7. **HTTP-only Cookies**: Session cookies are HTTP-only to prevent XSS attacks

## Usage Example

### Complete Workflow

1. **Admin logs in:**
```bash
curl -X POST http://localhost:8090/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' \
  -c cookies.txt
```

2. **Admin generates unique URL for a class:**
```bash
curl -X POST http://localhost:8090/api/students/class/Grade%2010A/generate-url \
  -b cookies.txt
```

3. **Share the generated URL** with authorized personnel (e.g., teachers, school staff)

4. **Access class records using the unique URL** (no authentication needed):
```bash
curl http://localhost:8090/api/students/class/Grade%2010A/550e8400-e29b-41d4-a716-446655440000
```

## Database

Currently uses in-memory storage for demonstration. In production:
- Replace with a proper database (PostgreSQL, MongoDB, MySQL, etc.)
- Implement proper data persistence
- Add database migrations
- Implement proper backup strategies

## Notes

- All class names in URLs must be URL-encoded (spaces become %20)
- Session cookies are secure in production (HTTPS only)
- Tokens remain valid until a new one is generated for the same class
- Default data includes 5 sample students across 3 classes

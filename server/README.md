# Student Record Database System

A secure student record management system with admin-only access control and unique URL generation for accessing class records.

## Features

✅ **Admin Authentication**: Secure session-based authentication for administrators  
✅ **Student Records Management**: Store and manage student information including name, class, age, student ID, and email  
✅ **Class-Based Access**: Request student records by class  
✅ **Unique URL Generation**: Generate secure, unique URLs for accessing specific class records  
✅ **Access Control**: Restrict full database access to admin users only  
✅ **Input Validation**: All inputs are validated for security  
✅ **Password Security**: Passwords are hashed using bcryptjs  

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The server will start on `http://localhost:8090`

### Default Credentials
```
Username: admin
Password: admin123
```
⚠️ **Important**: Change these credentials in production!

## Usage

### 1. Admin Login
First, authenticate as an admin:

```bash
curl -X POST http://localhost:8090/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}' \
  -c cookies.txt
```

### 2. View All Classes
Get a list of all available classes:

```bash
curl http://localhost:8090/api/classes -b cookies.txt
```

Response:
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

### 3. Generate Unique URL for a Class
Create a secure URL to access a specific class's records:

```bash
curl -X POST "http://localhost:8090/api/students/class/Grade%2010A/generate-url" \
  -b cookies.txt
```

Response:
```json
{
  "message": "Unique access URL generated successfully",
  "className": "Grade 10A",
  "accessUrl": "/api/students/class/Grade%2010A/550e8400-e29b-41d4-a716-446655440000",
  "fullUrl": "http://localhost:8090/api/students/class/Grade%2010A/550e8400-e29b-41d4-a716-446655440000"
}
```

### 4. Access Class Records (Using Unique URL)
Anyone with the unique URL can access the class records without admin login:

```bash
curl "http://localhost:8090/api/students/class/Grade%2010A/550e8400-e29b-41d4-a716-446655440000"
```

Response:
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

### 5. Add a New Student
Admins can add new students to the database:

```bash
curl -X POST http://localhost:8090/api/students \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "New Student",
    "class": "Grade 10A",
    "age": 15,
    "studentId": "S006",
    "email": "newstudent@example.com"
  }'
```

## API Endpoints

### Public Endpoints
- `GET /` - API information and endpoint list

### Authentication Endpoints
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Logout

### Admin-Only Endpoints
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get single student by ID
- `POST /api/students` - Add new student
- `GET /api/classes` - Get all classes
- `POST /api/students/class/:className/generate-url` - Generate unique URL for class

### Unique URL Access
- `GET /api/students/class/:className/:uniqueId` - Get students by class (requires valid unique token)

## Security Features

1. **Session-Based Authentication**: Secure session management for admin users
2. **Password Hashing**: All passwords are hashed using bcryptjs
3. **Input Validation**: All inputs are validated using express-validator
4. **Unique Access Tokens**: Class records are accessed via UUID-based tokens
5. **HTTP-Only Cookies**: Session cookies are HTTP-only to prevent XSS attacks
6. **CORS Protection**: Cross-origin requests are controlled
7. **Admin-Only Access**: Full database access restricted to authenticated admins

## Sample Data

The system comes pre-loaded with 5 sample students across 3 classes:

- **Grade 10A**: 2 students (John Doe, Jane Smith)
- **Grade 10B**: 1 student (Bob Johnson)
- **Grade 11A**: 2 students (Alice Brown, Charlie Wilson)

## Documentation

For complete API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Architecture

### Current Implementation
- **Backend**: Node.js with Express
- **Database**: In-memory storage (arrays/objects)
- **Authentication**: express-session
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Token Generation**: uuid v4

### Production Recommendations
For production deployment, consider:
- Migrating to a proper database (PostgreSQL, MongoDB, MySQL)
- Implementing token expiration
- Adding rate limiting
- Using environment variables for configuration
- Implementing HTTPS
- Adding logging and monitoring
- Implementing backup strategies
- Adding email notifications for access URL generation

## License

ISC

## Author

Created for educational and demonstration purposes.

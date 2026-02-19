const express = require("express")
const session = require("express-session")
const bcrypt = require("bcryptjs")
const { v4: uuidv4 } = require("uuid")
const cors = require("cors")
const { body, validationResult } = require("express-validator")

// creating an Express instance
const app = express()
const PORT = process.env.PORT || 8090

// Middleware
app.use(express.json())
app.use(cors({
    origin: true,
    credentials: true
}))
app.use(session({
    secret: process.env.SESSION_SECRET || 'student-record-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}))

// In-memory database (for demonstration - use a real database in production)
const adminUsers = [
    {
        id: 1,
        username: "admin",
        // Password: "admin123" (hashed)
        passwordHash: bcrypt.hashSync("admin123", 10),
        role: "admin"
    }
]

const students = [
    { id: 1, name: "John Doe", class: "Grade 10A", age: 15, studentId: "S001", email: "john@example.com" },
    { id: 2, name: "Jane Smith", class: "Grade 10A", age: 16, studentId: "S002", email: "jane@example.com" },
    { id: 3, name: "Bob Johnson", class: "Grade 10B", age: 15, studentId: "S003", email: "bob@example.com" },
    { id: 4, name: "Alice Brown", class: "Grade 11A", age: 16, studentId: "S004", email: "alice@example.com" },
    { id: 5, name: "Charlie Wilson", class: "Grade 11A", age: 17, studentId: "S005", email: "charlie@example.com" }
]

// Store unique access tokens for classes
const classAccessTokens = {}

// Middleware to check if user is authenticated as admin
const requireAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(401).json({ error: "Unauthorized. Admin access required." })
    }
    next()
}

// Middleware to validate unique access token
const validateAccessToken = (req, res, next) => {
    const { className, uniqueId } = req.params
    
    if (!classAccessTokens[className] || classAccessTokens[className] !== uniqueId) {
        return res.status(403).json({ error: "Invalid or expired access token for this class." })
    }
    next()
}

// Root endpoint
app.get("/", (req, res) => {
    res.json({ 
        message: "Student Record Database API",
        version: "1.0.0",
        endpoints: {
            login: "POST /api/auth/login",
            logout: "POST /api/auth/logout",
            generateClassUrl: "POST /api/students/class/:className/generate-url (admin only)",
            getStudentsByClass: "GET /api/students/class/:className/:uniqueId",
            addStudent: "POST /api/students (admin only)",
            getStudent: "GET /api/students/:id (admin only)",
            getAllStudents: "GET /api/students (admin only)"
        }
    })
})

// Auth endpoints
app.post("/api/auth/login", [
    body('username').notEmpty().trim(),
    body('password').notEmpty()
], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { username, password } = req.body
    
    const user = adminUsers.find(u => u.username === username)
    if (!user) {
        return res.status(401).json({ error: "Invalid credentials" })
    }
    
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" })
    }
    
    req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role
    }
    
    res.json({ 
        message: "Login successful",
        user: {
            username: user.username,
            role: user.role
        }
    })
})

app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to logout" })
        }
        res.json({ message: "Logout successful" })
    })
})

// Generate unique URL for a class (admin only)
app.post("/api/students/class/:className/generate-url", requireAdmin, (req, res) => {
    const { className } = req.params
    
    // Check if class exists
    const classStudents = students.filter(s => s.class === className)
    if (classStudents.length === 0) {
        return res.status(404).json({ error: "Class not found" })
    }
    
    // Generate unique token
    const uniqueId = uuidv4()
    classAccessTokens[className] = uniqueId
    
    const accessUrl = `/api/students/class/${encodeURIComponent(className)}/${uniqueId}`
    
    res.json({
        message: "Unique access URL generated successfully",
        className: className,
        accessUrl: accessUrl,
        fullUrl: `${req.protocol}://${req.get('host')}${accessUrl}`,
        expiresIn: "This token remains valid until a new one is generated for this class"
    })
})

// Get students by class using unique URL (public access with valid token)
app.get("/api/students/class/:className/:uniqueId", validateAccessToken, (req, res) => {
    const { className } = req.params
    
    const classStudents = students.filter(s => s.class === className)
    
    if (classStudents.length === 0) {
        return res.status(404).json({ error: "No students found in this class" })
    }
    
    res.json({
        className: className,
        totalStudents: classStudents.length,
        students: classStudents
    })
})

// Get all students (admin only)
app.get("/api/students", requireAdmin, (req, res) => {
    res.json({
        totalStudents: students.length,
        students: students
    })
})

// Get single student by ID (admin only)
app.get("/api/students/:id", requireAdmin, (req, res) => {
    const studentId = parseInt(req.params.id)
    const student = students.find(s => s.id === studentId)
    
    if (!student) {
        return res.status(404).json({ error: "Student not found" })
    }
    
    res.json(student)
})

// Add new student (admin only)
app.post("/api/students", [
    requireAdmin,
    body('name').notEmpty().trim(),
    body('class').notEmpty().trim(),
    body('age').isInt({ min: 5, max: 25 }),
    body('studentId').notEmpty().trim(),
    body('email').isEmail()
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { name, class: className, age, studentId, email } = req.body
    
    // Check if student ID already exists
    if (students.find(s => s.studentId === studentId)) {
        return res.status(400).json({ error: "Student ID already exists" })
    }
    
    const newStudent = {
        id: students.length + 1,
        name,
        class: className,
        age,
        studentId,
        email
    }
    
    students.push(newStudent)
    
    res.status(201).json({
        message: "Student added successfully",
        student: newStudent
    })
})

// Get list of all classes (admin only)
app.get("/api/classes", requireAdmin, (req, res) => {
    const classes = [...new Set(students.map(s => s.class))]
    const classesWithCount = classes.map(className => ({
        className: className,
        studentCount: students.filter(s => s.class === className).length
    }))
    
    res.json({
        totalClasses: classes.length,
        classes: classesWithCount
    })
})

// running the server
app.listen(PORT, () => {
    console.log(`Starting Express server on http://localhost:${PORT}`)
    console.log(`\nDefault admin credentials:`)
    console.log(`  Username: admin`)
    console.log(`  Password: admin123`)
    console.log(`\nPlease change these credentials in production!`)
})

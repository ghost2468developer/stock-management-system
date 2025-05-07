const express = require('express')
const fs = require('fs')
const path = require('path')
const router = express.Router()

// Paths
const dataDir = path.join(__dirname, '../data')
const usersFilePath = path.join(dataDir, 'users.json')

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
}

// Ensure users.json file exists and contains valid JSON
try {
    const fileContent = fs.existsSync(usersFilePath) ? fs.readFileSync(usersFilePath, 'utf-8') : ''
    if (!fileContent.trim()) {
        fs.writeFileSync(usersFilePath, '[]')
    } else {
        JSON.parse(fileContent)
    }
} catch (err) {
    fs.writeFileSync(usersFilePath, '[]') // reset file if corrupt
}

// Load users safely
function loadUsers() {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf-8')
        return data ? JSON.parse(data) : []
    } catch (error) {
        console.error('Error reading users.json:', error)
        return []
    }
}

// Save users
function saveUsers(users) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2))
}

// Register route
router.post('/register', (req, res) => {
    const { username, password } = req.body
    const users = loadUsers()

    const existingUser = users.find(user => user.username === username)
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' })
    }

    const newUser = { username, password }
    users.push(newUser)
    saveUsers(users)

    res.status(201).json({ message: 'User registered successfully' })
})

// Login route
router.post('/login', (req, res) => {
    const { username, password } = req.body
    const users = loadUsers()

    const user = users.find(u => u.username === username && u.password === password)
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' })
    }

    res.status(200).json({ message: 'Login successful' })
})

module.exports = router
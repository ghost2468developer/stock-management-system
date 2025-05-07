const express = require('express')
const fs = require('fs')
const crypto = require('crypto')
const router = express.Router()

const USERS_FILE = './backend/data/users.json'

// Helpers
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]')
  return JSON.parse(fs.readFileSync(USERS_FILE))
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
}

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { username, password } = req.body
  const users = loadUsers()
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Username already exists' })
  }
  const hashed = crypto.createHash('sha256').update(password).digest('hex')
  const user = { id: Date.now(), username, password: hashed }
  users.push(user)
  saveUsers(users)
  res.json({ message: 'User registered successfully' })
})

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body
  const users = loadUsers()
  const hashed = crypto.createHash('sha256').update(password).digest('hex')
  const user = users.find(u => u.username === username && u.password === hashed)
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })
  res.json({ message: 'Login successful', userId: user.id })
})

module.exports = router
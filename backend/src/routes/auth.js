const express = require('express')
const router = express.Router()
const { login, register, me } = require('../controllers/authController')
const { authenticateToken } = require('../middleware/authMiddleware.js')

// Routes
router.post('/login', login)
router.post('/register', register)
router.get('/me', authenticateToken, me)

module.exports = router
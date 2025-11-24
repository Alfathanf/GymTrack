const express = require('express')
const router = express.Router()
const auth = require('../controllers/authController')
const { authMiddleware } = require('../middleware/authMiddleware')

// POST /api/auth/login
router.post('/login', auth.login)

// POST /api/auth/register  (optional, creates user with password_hash)
router.post('/register', auth.register)

// GET /api/auth/me  (requires Bearer token)
router.get('/me', authMiddleware, auth.me)

module.exports = router

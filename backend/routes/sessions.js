const express = require('express')
const router = express.Router()
const sessions = require('../controllers/sessionsController')
const { authMiddleware } = require('../middleware/authMiddleware')

// GET /api/sessions?program_id=...  (returns sessions only for logged-in user's programs)
router.get('/', authMiddleware, sessions.getSessions)
router.post('/', authMiddleware, sessions.createSession)
router.put('/:id', authMiddleware, sessions.updateSession)
router.delete('/:id', authMiddleware, sessions.deleteSession)

module.exports = router

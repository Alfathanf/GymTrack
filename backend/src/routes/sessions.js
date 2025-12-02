const express = require('express')
const router = express.Router()
const sessionsController = require('../controllers/sessionsController')
const { authenticateToken } = require('../middleware/authMiddleware')


router.get('/today', authenticateToken, sessionsController.getToday)

// GET all sessions for logged-in user
router.get('/', authenticateToken, sessionsController.getAll)

// GET single session
router.get('/:id', authenticateToken, sessionsController.getById)

// POST create session
router.post('/', authenticateToken, sessionsController.create)

// PUT update session
router.put('/:id', authenticateToken, sessionsController.update)

// DELETE session
router.delete('/:id', authenticateToken, sessionsController.delete)

module.exports = router

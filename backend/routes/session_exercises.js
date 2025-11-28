const express = require('express')
const router = express.Router()
const session_exercisesController = require('../controllers/session_exercisesController')
const { authenticateToken } = require('../middleware/authMiddleware')

// GET all session_exercises for user
router.get('/', authenticateToken, session_exercisesController.getAll)

// GET single session_exercise
router.get('/:id', authenticateToken, session_exercisesController.getById)

// POST create session_exercise (add exercise to session)
router.post('/', authenticateToken, session_exercisesController.create)

// DELETE session_exercise (remove exercise from session)
router.delete('/:id', authenticateToken, session_exercisesController.delete)

module.exports = router

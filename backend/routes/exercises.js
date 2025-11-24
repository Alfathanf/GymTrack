const express = require('express')
const router = express.Router()
const exercises = require('../controllers/exercisesController')
const { authMiddleware } = require('../middleware/authMiddleware')

// GET /api/exercises?session_id=...  or GET all exercises for logged-in user
router.get('/', authMiddleware, exercises.getExercises)
router.post('/', authMiddleware, exercises.createExercise)
router.put('/:id', authMiddleware, exercises.updateExercise)
router.delete('/:id', authMiddleware, exercises.deleteExercise)

module.exports = router

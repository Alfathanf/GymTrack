const express = require('express')
const router = express.Router()
const exercisesController = require('../controllers/exercisesController')
const { authenticateToken } = require('../middleware/authMiddleware')

// GET all exercises for logged-in user
router.get('/', authenticateToken, exercisesController.getAll)

// GET single exercise
router.get('/:id', authenticateToken, exercisesController.getById)

// POST create exercise
router.post('/', authenticateToken, exercisesController.create)

// PUT update exercise
router.put('/:id', authenticateToken, exercisesController.update)

// DELETE exercise
router.delete('/:id', authenticateToken, exercisesController.delete)

module.exports = router

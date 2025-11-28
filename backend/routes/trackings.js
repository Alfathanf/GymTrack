const express = require('express')
const router = express.Router()
const trackingsController = require('../controllers/trackingsController')
const { authenticateToken } = require('../middleware/authMiddleware')

// GET all trackings for user's exercises
router.get('/', authenticateToken, trackingsController.getAll)

// GET single tracking
router.get('/:id', authenticateToken, trackingsController.getByExerciseId)

// POST create tracking
router.post('/', authenticateToken, trackingsController.create)

// PUT update tracking
router.put('/:id', authenticateToken, trackingsController.update)

// DELETE tracking
router.delete('/:id', authenticateToken, trackingsController.delete)

module.exports = router

const express = require('express')
const router = express.Router()
const trackings = require('../controllers/trackingsController')
const { authMiddleware } = require('../middleware/authMiddleware')

// GET /api/tracking/                        -> all trackings for user
// GET /api/tracking/exercise/:exerciseId   -> history for a specific exercise
router.get('/', authMiddleware, trackings.getAllTrackings)
router.get('/exercise/:exerciseId', authMiddleware, trackings.getTrackingByExercise)
router.post('/', authMiddleware, trackings.createTracking)
router.delete('/:id', authMiddleware, trackings.deleteTracking)

module.exports = router

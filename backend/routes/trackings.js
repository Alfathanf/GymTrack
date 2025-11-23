const express = require('express')
const router = express.Router()
const trackings = require('../controllers/trackingsController')

router.get('/:id', trackings.getAllTrackings)
router.get('/:exerciseId', trackings.getTrackingByExercise)
router.post('/', trackings.createTracking)
router.delete('/:id', trackings.deleteTracking)

module.exports = router

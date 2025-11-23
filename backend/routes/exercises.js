const express = require('express')
const router = express.Router()
const exercises = require('../controllers/exercisesController')

router.get('/:id', exercises.getExercises)
router.post('/', exercises.createExercise)
router.put('/:id', exercises.updateExercise)
router.delete('/:id', exercises.deleteExercise)

module.exports = router

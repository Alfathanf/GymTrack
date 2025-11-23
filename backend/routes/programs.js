const express = require('express')
const router = express.Router()
const programs = require('../controllers/programsController')

router.get('/:id', programs.getPrograms)
router.post('/', programs.createProgram)
router.put('/:id', programs.updateProgram)
router.delete('/:id', programs.deleteProgram)

module.exports = router

const express = require('express')
const router = express.Router()
const programs = require('../controllers/programsController')
const { authMiddleware } = require('../middleware/authMiddleware')

router.get('/', authMiddleware, programs.getPrograms)
router.post('/', authMiddleware, programs.createProgram)
router.put('/:id', authMiddleware, programs.updateProgram)
router.delete('/:id', authMiddleware, programs.deleteProgram)

module.exports = router

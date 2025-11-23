const express = require('express')
const router = express.Router()
const sessions = require('../controllers/sessionsController')

router.get('/:id', sessions.getSessions)
router.post('/', sessions.createSession)
router.put('/:id', sessions.updateSession)
router.delete('/:id', sessions.deleteSession)

module.exports = router

const express = require('express')
const router = express.Router()
const users = require('../controllers/usersController')
const { authMiddleware } = require('../middleware/authMiddleware')

router.get('/', authMiddleware, users.getAllUsers)
router.get('/:id', authMiddleware, users.getUserById)
router.post('/', users.createUser)
router.put('/:id', authMiddleware, users.updateUser)
router.delete('/:id', authMiddleware, users.deleteUser)

module.exports = router

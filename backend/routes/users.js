const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const { authenticateToken } = require('../middleware/authMiddleware')

// GET current user profile
router.get('/', authenticateToken, usersController.getAll)

// GET single user (self only)
router.get('/:id', authenticateToken, usersController.getById)

// POST create user (registration)
router.post('/', usersController.create)

// PUT update user (self only)
router.put('/:id', authenticateToken, usersController.update)

// DELETE user (self only)
router.delete('/:id', authenticateToken, usersController.delete)

module.exports = router

const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const { authenticateToken } = require('../middleware/authMiddleware')
const upload = require('../middleware/upload') 

// =====================
// 🧠 ROUTES USERS
// =====================

// GET all users
router.get('/', authenticateToken, usersController.getAll)

// GET single user by ID
router.get('/:id', authenticateToken, usersController.getById)

// POST create user (register)
router.post('/', usersController.create)

// ✅ UPLOAD PHOTO (gunakan middleware upload dari Cloudinary)
router.post('/upload-photo', authenticateToken, upload.single('photo'), usersController.uploadPhoto)

// PUT update user data
router.put('/:id', authenticateToken, usersController.update)

// DELETE user
router.delete('/:id', authenticateToken, usersController.delete)

module.exports = router

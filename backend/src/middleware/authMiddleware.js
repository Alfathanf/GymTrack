const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

// Middleware: authenticateToken — verifies Bearer token and sets req.user
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ success: false, error: 'Missing authorization token' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET || 'dev-secret')
    req.user = decoded // { id, email, name }
    next()
  } catch (err) {
    return res.status(403).json({ success: false, error: 'Invalid or expired token' })
  }
}

module.exports = { authenticateToken }

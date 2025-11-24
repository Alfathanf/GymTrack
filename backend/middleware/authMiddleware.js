const jwt = require('jsonwebtoken')

const secret = process.env.JWT_SECRET

if (!secret) {
  throw new Error('JWT_SECRET is not set in environment variables')
}

// authMiddleware checks for Bearer token and attaches payload to req.user
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' })
  }

  const token = auth.split(' ')[1]
  try {
    const payload = jwt.verify(token, secret)
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

module.exports = { authMiddleware }

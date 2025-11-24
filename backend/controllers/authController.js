const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { supabase } = require('../supabaseClient')

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set. Set it in .env for secure tokens.')
}

// Authenticate user by email + password stored as bcrypt hash in users.password_hash
exports.login = async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' })

  // Query Supabase users table for the user by email
  const { data: users, error } = await supabase.from('users').select('*').eq('email', email).limit(1)
  if (error) return res.status(500).json({ error: error.message })
  if (!users || users.length === 0) return res.status(401).json({ error: 'Invalid credentials' })

  const user = users[0]
  const hash = user.password
  if (!hash) return res.status(401).json({ error: 'Invalid credentials' })

  const match = await bcrypt.compare(password, hash)
  if (!match) return res.status(401).json({ error: 'Invalid credentials' })

  // Create token payload (avoid sensitive fields)
  const payload = { id: user.id, email: user.email, name: user.name }
  const token = jwt.sign(payload, JWT_SECRET || 'dev-secret', { expiresIn: '12h' })

  res.json({ token, user: payload })
}

// Optional: register endpoint to create user with bcrypt password
exports.register = async (req, res) => {
  const { email, password, name, height, weight } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' })

  // Check existing user
  const { data: existing, error: qerr } = await supabase.from('users').select('id').eq('email', email).limit(1)
  if (qerr) return res.status(500).json({ error: qerr.message })
  if (existing && existing.length > 0) return res.status(409).json({ error: 'User already exists' })

  const hash = await bcrypt.hash(password, 10)
  const payload = { email, name: name || null, height: height || null, weight: weight || null, password: hash }

  const { data, error: insertErr } = await supabase.from('users').insert(payload).select()
  if (insertErr) return res.status(500).json({ error: insertErr.message })

  const created = data[0]
  const token = jwt.sign({ id: created.id, email: created.email, name: created.name }, JWT_SECRET || 'dev-secret', { expiresIn: '12h' })
  res.status(201).json({ token, user: { id: created.id, email: created.email, name: created.name } })
}

// Optional: get current user from token (requires authMiddleware)
exports.me = async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' })
  // Optionally fetch fresh user data from DB
  const { id } = req.user
  const { data, error } = await supabase.from('users').select('id,name,email,height,weight').eq('id', id).single()
  if (error) return res.status(500).json({ error: error.message })
  res.json({ user: data })
}

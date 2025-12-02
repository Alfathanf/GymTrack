const { supabase } = require('../supabaseClient')
const bcrypt = require('bcrypt')

// GET all users (only return authenticated user's profile)
exports.getAll = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' })

    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, height, weight, created_at')
      .eq('id', userId)
      .single()

    if (error) return res.status(500).json({ success: false, error: error.message })
    return res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// GET single user by ID (only own profile)
exports.getById = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    if (String(id) !== String(userId)) {
      return res.status(403).json({ success: false, error: 'Forbidden' })
    }

    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, height, weight, created_at')
      .eq('id', id)
      .single()

    if (error) return res.status(404).json({ success: false, error: 'User not found' })
    return res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// POST create user (typically via auth/register)
exports.create = async (req, res) => {
  try {
    const { email, password, name, height, weight } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'email and password required' })
    }

    const hash = await bcrypt.hash(password, 10)
    const { data, error } = await supabase
      .from('users')
      .insert({ email, password_hash: hash, name, height, weight })
      .select('id, email, name, height, weight, created_at')

    if (error) return res.status(400).json({ success: false, error: error.message })
    return res.status(201).json({ success: true, data: data[0] })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// PUT update user (only own profile)
exports.update = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id
    const { name, height, weight } = req.body

    if (String(id) !== String(userId)) {
      return res.status(403).json({ success: false, error: 'Forbidden' })
    }

    const { data, error } = await supabase
      .from('users')
     .update({ name, height, weight })
      .eq('id', id)
      .select('id, email, name, height, weight, created_at')

    if (error) return res.status(500).json({ success: false, error: error.message })
    return res.json({ success: true, data: data[0] })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// DELETE user (only own account)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    if (String(id) !== String(userId)) {
      return res.status(403).json({ success: false, error: 'Forbidden' })
    }

    const { error } = await supabase.from('users').delete().eq('id', id)

    if (error) return res.status(500).json({ success: false, error: error.message })
    return res.status(204).end()
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

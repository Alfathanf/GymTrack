const { supabase } = require('../supabaseClient')

// Controller functions for users table
exports.getAllUsers = async (req, res) => {
  // Select non-sensitive fields only
  const { data, error } = await supabase.from('users').select('id,name,email,height,weight')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

exports.getUserById = async (req, res) => {
  const { id } = req.params
  const { data, error } = await supabase.from('users').select('id,name,email,height,weight').eq('id', id).single()
  if (error) return res.status(404).json({ error: error.message })
  res.json(data)
}

exports.createUser = async (req, res) => {
  const payload = req.body
  const { data, error } = await supabase.from('users').insert(payload).select()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data[0])
}

exports.updateUser = async (req, res) => {
  const { id } = req.params
  const payload = req.body
  const { data, error } = await supabase.from('users').update(payload).eq('id', id).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
}

exports.deleteUser = async (req, res) => {
  const { id } = req.params
  const { error } = await supabase.from('users').delete().eq('id', id)
  if (error) return res.status(500).json({ error: error.message })
  res.status(204).end()
}

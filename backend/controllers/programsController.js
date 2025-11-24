const { supabase } = require('../supabaseClient')

// Get all programs for the logged-in user
exports.getPrograms = async (req, res) => {
  const userId = req.user && req.user.id
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })

  const { data, error } = await supabase.from('programs').select('*').eq('user_id', userId)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

// Create program for logged-in user
exports.createProgram = async (req, res) => {
  const userId = req.user && req.user.id
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })

  const payload = { ...req.body, user_id: userId }
  const { data, error } = await supabase.from('programs').insert(payload).select()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data[0])
}

// Update a program belonging to the logged-in user
exports.updateProgram = async (req, res) => {
  const userId = req.user && req.user.id
  const { id } = req.params
  const payload = req.body
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })

  // ensure ownership
  const { data: existing, error: exErr } = await supabase.from('programs').select('user_id').eq('id', id).single()
  if (exErr || !existing) return res.status(404).json({ error: 'Program not found' })
  if (existing.user_id !== userId) return res.status(403).json({ error: 'Forbidden' })

  const { data, error } = await supabase.from('programs').update(payload).eq('id', id).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
}

// Delete a program belonging to the logged-in user
exports.deleteProgram = async (req, res) => {
  const userId = req.user && req.user.id
  const { id } = req.params
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })

  const { data: existing, error: exErr } = await supabase.from('programs').select('user_id').eq('id', id).single()
  if (exErr || !existing) return res.status(404).json({ error: 'Program not found' })
  if (existing.user_id !== userId) return res.status(403).json({ error: 'Forbidden' })

  const { error } = await supabase.from('programs').delete().eq('id', id)
  if (error) return res.status(500).json({ error: error.message })
  res.status(204).end()
}

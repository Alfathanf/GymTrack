const { supabase } = require('../supabaseClient')

exports.getExercises = async (req, res) => {
  const { session_id } = req.query
  let query = supabase.from('exercises').select('*')
  if (session_id) query = query.eq('session_id', session_id)
  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

exports.createExercise = async (req, res) => {
  const payload = req.body
  const { data, error } = await supabase.from('exercises').insert(payload).select()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data[0])
}

exports.updateExercise = async (req, res) => {
  const { id } = req.params
  const payload = req.body
  const { data, error } = await supabase.from('exercises').update(payload).eq('id', id).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
}

exports.deleteExercise = async (req, res) => {
  const { id } = req.params
  const { error } = await supabase.from('exercises').delete().eq('id', id)
  if (error) return res.status(500).json({ error: error.message })
  res.status(204).end()
}

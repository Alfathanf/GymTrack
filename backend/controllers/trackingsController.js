const { supabase } = require('../supabaseClient')

// Create a tracking record
exports.createTracking = async (req, res) => {
  const payload = req.body
  const { data, error } = await supabase.from('trackings').insert(payload).select()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data[0])
}

// Get history for an exercise. :exerciseId param refers to exercise_id
exports.getTrackingByExercise = async (req, res) => {
  const { exerciseId } = req.params
  const { data, error } = await supabase.from('trackings').select('*').eq('exercise_id', exerciseId).order('date', { ascending: true })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

// Basic CRUD
exports.getAllTrackings = async (req, res) => {
  const { data, error } = await supabase.from('trackings').select('*')
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

exports.deleteTracking = async (req, res) => {
  const { id } = req.params
  const { error } = await supabase.from('trackings').delete().eq('id', id)
  if (error) return res.status(500).json({ error: error.message })
  res.status(204).end()
}

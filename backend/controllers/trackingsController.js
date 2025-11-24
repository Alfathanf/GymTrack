const { supabase } = require('../supabaseClient')

// helper: verify exercise belongs to user's programs
async function exerciseBelongsToUser(exerciseId, userId) {
  const { data: ex, error } = await supabase.from('exercises').select('session_id').eq('id', exerciseId).single()
  if (error || !ex) return false
  const { data: session } = await supabase.from('sessions').select('program_id').eq('id', ex.session_id).single()
  if (!session) return false
  const { data: program } = await supabase.from('programs').select('user_id').eq('id', session.program_id).single()
  if (!program) return false
  return program.user_id === userId
}

// Create a tracking record owned by the user's exercise
exports.createTracking = async (req, res) => {
  const userId = req.user && req.user.id
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })
  const { exercise_id } = req.body
  if (!exercise_id) return res.status(400).json({ error: 'exercise_id required' })
  const ok = await exerciseBelongsToUser(exercise_id, userId)
  if (!ok) return res.status(403).json({ error: 'Forbidden' })

  const payload = req.body
  const { data, error } = await supabase.from('trackings').insert(payload).select()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data[0])
}

// Get history for an exercise (only if it belongs to user)
exports.getTrackingByExercise = async (req, res) => {
  const userId = req.user && req.user.id
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })
  const { exerciseId } = req.params
  const ok = await exerciseBelongsToUser(exerciseId, userId)
  if (!ok) return res.status(403).json({ error: 'Forbidden' })

  const { data, error } = await supabase.from('trackings').select('*').eq('exercise_id', exerciseId).order('date', { ascending: true })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

// Get all trackings for user's exercises
exports.getAllTrackings = async (req, res) => {
  const userId = req.user && req.user.id
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })

  // get user's exercises
  const { data: programs } = await supabase.from('programs').select('id').eq('user_id', userId)
  const pIds = programs.map(p => p.id)
  const { data: sessions } = await supabase.from('sessions').select('id').in('program_id', pIds)
  const sIds = sessions.map(s => s.id)
  const { data: exercises } = await supabase.from('exercises').select('id').in('session_id', sIds)
  const eIds = exercises.map(e => e.id)

  const { data, error } = await supabase.from('trackings').select('*').in('exercise_id', eIds)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

exports.deleteTracking = async (req, res) => {
  const userId = req.user && req.user.id
  const { id } = req.params
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })

  // ensure the tracking belongs to user's exercise
  const { data: tracking, error: tErr } = await supabase.from('trackings').select('exercise_id').eq('id', id).single()
  if (tErr || !tracking) return res.status(404).json({ error: 'Tracking not found' })
  const ok = await exerciseBelongsToUser(tracking.exercise_id, userId)
  if (!ok) return res.status(403).json({ error: 'Forbidden' })

  const { error } = await supabase.from('trackings').delete().eq('id', id)
  if (error) return res.status(500).json({ error: error.message })
  res.status(204).end()
}

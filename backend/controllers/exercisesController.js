const { supabase } = require('../supabaseClient')

// Helper: verify session -> program belongs to user
async function sessionBelongsToUser(sessionId, userId) {
  const { data, error } = await supabase.from('sessions').select('program_id').eq('id', sessionId).single()
  if (error || !data) return false
  const { data: program } = await supabase.from('programs').select('user_id').eq('id', data.program_id).single()
  if (!program) return false
  return program.user_id === userId
}

exports.getExercises = async (req, res) => {
  const userId = req.user && req.user.id
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })

  const { session_id } = req.query
  if (session_id) {
    const ok = await sessionBelongsToUser(session_id, userId)
    if (!ok) return res.status(403).json({ error: 'Forbidden' })
    const { data, error } = await supabase.from('exercises').select('*').eq('session_id', session_id)
    if (error) return res.status(500).json({ error: error.message })
    return res.json(data)
  }

  // Get all exercises belonging to user's programs
  const { data: programs, error: pErr } = await supabase.from('programs').select('id').eq('user_id', userId)
  if (pErr) return res.status(500).json({ error: pErr.message })
  const pIds = programs.map(p => p.id)
  // Find sessions in these programs
  const { data: sessions, error: sErr } = await supabase.from('sessions').select('id').in('program_id', pIds)
  if (sErr) return res.status(500).json({ error: sErr.message })
  const sIds = sessions.map(s => s.id)
  const { data, error } = await supabase.from('exercises').select('*').in('session_id', sIds)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

exports.createExercise = async (req, res) => {
  const userId = req.user && req.user.id
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })
  const { session_id } = req.body
  if (!session_id) return res.status(400).json({ error: 'session_id is required' })
  const ok = await sessionBelongsToUser(session_id, userId)
  if (!ok) return res.status(403).json({ error: 'Forbidden' })

  const payload = req.body
  const { data, error } = await supabase.from('exercises').insert(payload).select()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data[0])
}

exports.updateExercise = async (req, res) => {
  const userId = req.user && req.user.id
  const { id } = req.params
  const payload = req.body
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })

  const { data: exercise, error: eErr } = await supabase.from('exercises').select('session_id').eq('id', id).single()
  if (eErr || !exercise) return res.status(404).json({ error: 'Exercise not found' })
  const ok = await sessionBelongsToUser(exercise.session_id, userId)
  if (!ok) return res.status(403).json({ error: 'Forbidden' })

  const { data, error } = await supabase.from('exercises').update(payload).eq('id', id).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
}

exports.deleteExercise = async (req, res) => {
  const userId = req.user && req.user.id
  const { id } = req.params
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })

  const { data: exercise, error: eErr } = await supabase.from('exercises').select('session_id').eq('id', id).single()
  if (eErr || !exercise) return res.status(404).json({ error: 'Exercise not found' })
  const ok = await sessionBelongsToUser(exercise.session_id, userId)
  if (!ok) return res.status(403).json({ error: 'Forbidden' })

  const { error } = await supabase.from('exercises').delete().eq('id', id)
  if (error) return res.status(500).json({ error: error.message })
  res.status(204).end()
}

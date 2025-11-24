const { supabase } = require('../supabaseClient')

// Helper: ensure program belongs to user
async function programBelongsToUser(programId, userId) {
  const { data, error } = await supabase.from('programs').select('user_id').eq('id', programId).single()
  if (error || !data) return false
  return data.user_id === userId
}

exports.getSessions = async (req, res) => {
  const userId = req.user && req.user.id
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })

  const { program_id } = req.query
  // If program_id provided, verify it belongs to user
  if (program_id) {
    const ok = await programBelongsToUser(program_id, userId)
    if (!ok) return res.status(403).json({ error: 'Forbidden' })
    const { data, error } = await supabase.from('sessions').select('*').eq('program_id', program_id)
    if (error) return res.status(500).json({ error: error.message })
    return res.json(data)
  }

  // Otherwise fetch sessions for all user's programs
  const { data: programs, error: pErr } = await supabase.from('programs').select('id').eq('user_id', userId)
  if (pErr) return res.status(500).json({ error: pErr.message })
  const ids = programs.map(p => p.id)
  const { data, error } = await supabase.from('sessions').select('*').in('program_id', ids)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

exports.createSession = async (req, res) => {
  const userId = req.user && req.user.id
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })

  const { program_id } = req.body
  if (!program_id) return res.status(400).json({ error: 'program_id is required' })
  const ok = await programBelongsToUser(program_id, userId)
  if (!ok) return res.status(403).json({ error: 'Forbidden' })

  const payload = req.body
  const { data, error } = await supabase.from('sessions').insert(payload).select()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data[0])
}

exports.updateSession = async (req, res) => {
  const userId = req.user && req.user.id
  const { id } = req.params
  const payload = req.body
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })

  // ensure session belongs to a program of this user
  const { data: session, error: sErr } = await supabase.from('sessions').select('program_id').eq('id', id).single()
  if (sErr || !session) return res.status(404).json({ error: 'Session not found' })
  const ok = await programBelongsToUser(session.program_id, userId)
  if (!ok) return res.status(403).json({ error: 'Forbidden' })

  const { data, error } = await supabase.from('sessions').update(payload).eq('id', id).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
}

exports.deleteSession = async (req, res) => {
  const userId = req.user && req.user.id
  const { id } = req.params
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })

  const { data: session, error: sErr } = await supabase.from('sessions').select('program_id').eq('id', id).single()
  if (sErr || !session) return res.status(404).json({ error: 'Session not found' })
  const ok = await programBelongsToUser(session.program_id, userId)
  if (!ok) return res.status(403).json({ error: 'Forbidden' })

  const { error } = await supabase.from('sessions').delete().eq('id', id)
  if (error) return res.status(500).json({ error: error.message })
  res.status(204).end()
}

const { supabase } = require('../supabaseClient')

exports.getSessions = async (req, res) => {
  const { program_id } = req.query
  let query = supabase.from('sessions').select('*')
  if (program_id) query = query.eq('program_id', program_id)
  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

exports.createSession = async (req, res) => {
  const payload = req.body
  const { data, error } = await supabase.from('sessions').insert(payload).select()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data[0])
}

exports.updateSession = async (req, res) => {
  const { id } = req.params
  const payload = req.body
  const { data, error } = await supabase.from('sessions').update(payload).eq('id', id).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
}

exports.deleteSession = async (req, res) => {
  const { id } = req.params
  const { error } = await supabase.from('sessions').delete().eq('id', id)
  if (error) return res.status(500).json({ error: error.message })
  res.status(204).end()
}

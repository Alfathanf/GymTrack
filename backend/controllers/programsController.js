const { supabase } = require('../supabaseClient')

exports.getPrograms = async (req, res) => {
  const { user_id } = req.query
  let query = supabase.from('programs').select('*')
  if (user_id) query = query.eq('user_id', user_id)
  const { data, error } = await query
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

exports.createProgram = async (req, res) => {
  const payload = req.body
  const { data, error } = await supabase.from('programs').insert(payload).select()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data[0])
}

exports.updateProgram = async (req, res) => {
  const { id } = req.params
  const payload = req.body
  const { data, error } = await supabase.from('programs').update(payload).eq('id', id).select()
  if (error) return res.status(500).json({ error: error.message })
  res.json(data[0])
}

exports.deleteProgram = async (req, res) => {
  const { id } = req.params
  const { error } = await supabase.from('programs').delete().eq('id', id)
  if (error) return res.status(500).json({ error: error.message })
  res.status(204).end()
}

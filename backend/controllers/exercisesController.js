const { supabase } = require('../supabaseClient')

// GET all exercises for logged-in user
exports.getAll = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' })

    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('user_id', userId)

    if (error) return res.status(500).json({ success: false, error: error.message })
    return res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// GET single exercise by ID (only own)
exports.getById = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      return res.status(404).json({ success: false, error: 'Exercise not found' })
    }

    return res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// POST create exercise
exports.create = async (req, res) => {
  try {
    const userId = req.user?.id
    const { exercise_name } = req.body

    if (!exercise_name) {
      return res.status(400).json({ success: false, error: 'exercise_name is required' })
    }

    const { data, error } = await supabase
      .from('exercises')
      .insert({ user_id: userId, exercise_name, })
      .select()

    if (error) return res.status(400).json({ success: false, error: error.message })
    return res.status(201).json({ success: true, data: data[0] })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// PUT update exercise (only own)
exports.update = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id
    const { exercise_name, muscle_group } = req.body

    // Verify ownership
    const { data: exercise, error: checkErr } = await supabase
      .from('exercises')
      .select('user_id')
      .eq('id', id)
      .single()

    if (checkErr || !exercise) {
      return res.status(404).json({ success: false, error: 'Exercise not found' })
    }

    if (String(exercise.user_id) !== String(userId)) {
      return res.status(403).json({ success: false, error: 'Forbidden' })
    }

    const { data, error } = await supabase
      .from('exercises')
      .update({ exercise_name, muscle_group })
      .eq('id', id)
      .select()

    if (error) return res.status(500).json({ success: false, error: error.message })
    return res.json({ success: true, data: data[0] })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// DELETE exercise (only own)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    // Verify ownership
    const { data: exercise, error: checkErr } = await supabase
      .from('exercises')
      .select('user_id')
      .eq('id', id)
      .single()

    if (checkErr || !exercise) {
      return res.status(404).json({ success: false, error: 'Exercise not found' })
    }

    if (String(exercise.user_id) !== String(userId)) {
      return res.status(403).json({ success: false, error: 'Forbidden' })
    }

    const { error } = await supabase.from('exercises').delete().eq('id', id)

    if (error) return res.status(500).json({ success: false, error: error.message })
    return res.status(204).end()
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

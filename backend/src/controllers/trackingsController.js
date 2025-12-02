const { supabase } = require('../supabaseClient')

// GET all trackings for user's exercises
exports.getAll = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' })

    // Get all exercise IDs belonging to user
    const { data: exercises } = await supabase
      .from('exercises')
      .select('id')
      .eq('user_id', userId)

    const exerciseIds = exercises ? exercises.map(e => e.id) : []

    if (!exerciseIds.length) {
      return res.json({ success: true, data: [] })
    }

    // Get trackings for these exercises
    const { data, error } = await supabase
      .from('trackings')
      .select('*, exercises(id, exercise_name)')
      .in('exercise_id', exerciseIds)

    if (error) return res.status(500).json({ success: false, error: error.message })
    return res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// GET all trackings for a given exercise_id (only for the logged-in user)
exports.getByExerciseId = async (req, res) => {
  try {
    const { id: exerciseId } = req.params
    const userId = req.user?.id

    // Ambil tracking berdasarkan exercise_id
    const { data, error } = await supabase
      .from('trackings')
      .select('*, exercises(id, exercise_name, user_id)')
      .eq('exercise_id', exerciseId)
      .order('date', { ascending: false }) // urutkan biar terbaru duluan

    if (error) throw error
    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, error: 'No tracking found for this exercise' })
    }

    // Pastikan exercise milik user
    const exerciseOwnerId = data[0].exercises?.user_id
    if (String(exerciseOwnerId) !== String(userId)) {
      return res.status(403).json({ success: false, error: 'Forbidden' })
    }

    return res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}


// POST create tracking
exports.create = async (req, res) => {
  try {
    const userId = req.user?.id
    const { exercise_id, weight, sets, reps, date, notes } = req.body

    if (!exercise_id) {
      return res.status(400).json({ success: false, error: 'exercise_id is required' })
    }

    // Verify exercise belongs to user
    const { data: exercise, error: eErr } = await supabase
      .from('exercises')
      .select('user_id')
      .eq('id', exercise_id)
      .single()

    if (eErr || !exercise) {
      return res.status(404).json({ success: false, error: 'Exercise not found' })
    }

    if (String(exercise.user_id) !== String(userId)) {
      return res.status(403).json({ success: false, error: 'Forbidden: exercise does not belong to user' })
    }

    // Create tracking
    const { data, error } = await supabase
      .from('trackings')
      .insert({ exercise_id, weight, sets, reps, date, notes })
      .select('*, exercises(id, exercise_name)')

    if (error) return res.status(400).json({ success: false, error: error.message })
    return res.status(201).json({ success: true, data: data[0] })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// PUT update tracking (only own)
exports.update = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id
    const { weight, sets, reps, date, notes } = req.body

    // Get tracking and verify ownership
    const { data: tracking, error: tErr } = await supabase
      .from('trackings')
      .select('exercise_id')
      .eq('id', id)
      .single()

    if (tErr || !tracking) {
      return res.status(404).json({ success: false, error: 'Tracking not found' })
    }

    const { data: exercise, error: eErr } = await supabase
      .from('exercises')
      .select('user_id')
      .eq('id', tracking.exercise_id)
      .single()

    if (eErr || !exercise || String(exercise.user_id) !== String(userId)) {
      return res.status(403).json({ success: false, error: 'Forbidden' })
    }

    const { data, error } = await supabase
      .from('trackings')
      .update({ weight, sets, reps, date, notes })
      .eq('id', id)
      .select('*, exercises(id, exercise_name)')

    if (error) return res.status(500).json({ success: false, error: error.message })
    return res.json({ success: true, data: data[0] })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// DELETE tracking (only own)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    // Get tracking and verify ownership
    const { data: tracking, error: tErr } = await supabase
      .from('trackings')
      .select('exercise_id')
      .eq('id', id)
      .single()

    if (tErr || !tracking) {
      return res.status(404).json({ success: false, error: 'Tracking not found' })
    }

    const { data: exercise, error: eErr } = await supabase
      .from('exercises')
      .select('user_id')
      .eq('id', tracking.exercise_id)
      .single()

    if (eErr || !exercise || String(exercise.user_id) !== String(userId)) {
      return res.status(403).json({ success: false, error: 'Forbidden' })
    }

    const { error } = await supabase.from('trackings').delete().eq('id', id)

    if (error) return res.status(500).json({ success: false, error: error.message })
    return res.status(204).end()
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

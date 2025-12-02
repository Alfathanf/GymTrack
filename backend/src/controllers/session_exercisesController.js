const { supabase } = require('../supabaseClient')

// GET all session_exercises for user's sessions and exercises
exports.getAll = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' })

    // Get all session IDs and exercise IDs belonging to user
    const { data: sessions } = await supabase
      .from('sessions')
      .select('id')
      .eq('user_id', userId)
    const sessionIds = sessions ? sessions.map(s => s.id) : []

    const { data: exercises } = await supabase
      .from('exercises')
      .select('id')
      .eq('user_id', userId)
    const exerciseIds = exercises ? exercises.map(e => e.id) : []

    if (!sessionIds.length || !exerciseIds.length) {
      return res.json({ success: true, data: [] })
    }

    // Get session_exercises that belong to user's sessions AND exercises
    const { data, error } = await supabase
      .from('session_exercises')
      .select('*, exercises(id, exercise_name)')
      .in('session_id', sessionIds)
      .in('exercise_id', exerciseIds)

    if (error) return res.status(500).json({ success: false, error: error.message })
    return res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// GET single session_exercise by ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    const { data, error } = await supabase
      .from('session_exercises')
      .select('*, exercises(id, exercise_name)')
      .eq('id', id)
      .single()

    if (error || !data) {
      return res.status(404).json({ success: false, error: 'Session exercise not found' })
    }

    // Verify ownership: check if session belongs to user
    const { data: session } = await supabase
      .from('sessions')
      .select('user_id')
      .eq('id', data.session_id)
      .single()

    if (!session || String(session.user_id) !== String(userId)) {
      return res.status(403).json({ success: false, error: 'Forbidden' })
    }

    return res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// POST create session_exercise (add exercise to session)
exports.create = async (req, res) => {
  try {
    const userId = req.user?.id
    const { session_id, exercise_id } = req.body

    if (!session_id || !exercise_id) {
      return res.status(400).json({ success: false, error: 'session_id and exercise_id are required' })
    }

    // Verify session belongs to user
    const { data: session, error: sErr } = await supabase
      .from('sessions')
      .select('user_id')
      .eq('id', session_id)
      .single()

    if (sErr || !session) {
      return res.status(404).json({ success: false, error: 'Session not found' })
    }

    if (String(session.user_id) !== String(userId)) {
      return res.status(403).json({ success: false, error: 'Forbidden: session does not belong to user' })
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

    // Create session_exercise
    const { data, error } = await supabase
      .from('session_exercises')
      .insert({ session_id, exercise_id })
      .select('*, exercises(id, exercise_name)')

    if (error) return res.status(400).json({ success: false, error: error.message })
    return res.status(201).json({ success: true, data: data[0] })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// DELETE session_exercise (remove exercise from session)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    // Get session_exercise and verify ownership
    const { data: seData, error: seErr } = await supabase
      .from('session_exercises')
      .select('session_id')
      .eq('id', id)
      .single()

    if (seErr || !seData) {
      return res.status(404).json({ success: false, error: 'Session exercise not found' })
    }

    const { data: session, error: sErr } = await supabase
      .from('sessions')
      .select('user_id')
      .eq('id', seData.session_id)
      .single()

    if (sErr || !session || String(session.user_id) !== String(userId)) {
      return res.status(403).json({ success: false, error: 'Forbidden' })
    }

    const { error } = await supabase.from('session_exercises').delete().eq('id', id)

    if (error) return res.status(500).json({ success: false, error: error.message })
    return res.status(204).end()
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

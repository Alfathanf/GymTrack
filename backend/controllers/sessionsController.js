const { supabase } = require('../supabaseClient')

// GET all sessions for logged-in user (with joined exercises)
exports.getAll = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' })

    // Fetch sessions for user
    const { data: sessions, error: sessErr } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)

    if (sessErr) return res.status(500).json({ success: false, error: sessErr.message })

    // For each session, fetch joined exercises
    const sessionsWithExercises = await Promise.all(
      sessions.map(async (session) => {
        const { data: exercises, error: exErr } = await supabase
          .from('session_exercises')
          .select('*, exercises(id, exercise_name, muscle_group)')
          .eq('session_id', session.id)

        if (exErr) console.error(exErr)
        return { ...session, exercises: exercises || [] }
      })
    )

    return res.json({ success: true, data: sessionsWithExercises })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// GET single session by ID (only own sessions)
exports.getById = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    const { data: session, error: sessErr } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (sessErr || !session) {
      return res.status(404).json({ success: false, error: 'Session not found' })
    }

    // Fetch exercises for this session
    const { data: exercises, error: exErr } = await supabase
      .from('session_exercises')
      .select('*, exercises(id, exercise_name)')
      .eq('session_id', id)

    if (exErr) console.error(exErr)

    const result = { ...session, exercises: exercises || [] }
    return res.json({ success: true, data: result })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// POST create session
exports.create = async (req, res) => {
  try {
    const userId = req.user?.id
    const { day_of_week, is_active, session_name } = req.body

    if (!day_of_week) {
      return res.status(400).json({ success: false, error: 'day_of_week is required' })
    }

    const { data, error } = await supabase
      .from('sessions')
      .insert({ user_id: userId, day_of_week, is_active: is_active, session_name: session_name || false })
      .select()

    if (error) return res.status(400).json({ success: false, error: error.message })
    return res.status(201).json({ success: true, data: data[0] })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// PUT update session (only own)
exports.update = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id
    const { day_of_week, is_active } = req.body

    // Verify ownership
    const { data: session, error: checkErr } = await supabase
      .from('sessions')
      .select('user_id')
      .eq('id', id)
      .single()

    if (checkErr || !session) {
      return res.status(404).json({ success: false, error: 'Session not found' })
    }

    if (String(session.user_id) !== String(userId)) {
      return res.status(403).json({ success: false, error: 'Forbidden' })
    }

    const { data, error } = await supabase
      .from('sessions')
      .update({ day_of_week, is_active })
      .eq('id', id)
      .select()

    if (error) return res.status(500).json({ success: false, error: error.message })
    return res.json({ success: true, data: data[0] })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// DELETE session (only own)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    // Verify ownership
    const { data: session, error: checkErr } = await supabase
      .from('sessions')
      .select('user_id')
      .eq('id', id)
      .single()

    if (checkErr || !session) {
      return res.status(404).json({ success: false, error: 'Session not found' })
    }

    if (String(session.user_id) !== String(userId)) {
      return res.status(403).json({ success: false, error: 'Forbidden' })
    }

    const { error } = await supabase.from('sessions').delete().eq('id', id)

    if (error) return res.status(500).json({ success: false, error: error.message })
    return res.status(204).end()
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

// GET today's session for logged-in user (with joined exercises)
exports.getToday = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()

    const { data: session, error: sessErr } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .ilike('day_of_week', today)
      .eq('is_active', true)
      .maybeSingle()

    if (sessErr) return res.status(500).json({ success: false, error: sessErr.message })
    if (!session) return res.status(404).json({ success: false, error: `No session found for ${today}` })

    // ✅ gunakan alias relasi yang benar
    const { data: exercises, error: exErr } = await supabase
      .from('session_exercises')
      .select('*, exercises:exercise_id(id, exercise_name)')
      .eq('session_id', session.id)

    if (exErr) console.error(exErr)

    const result = { ...session, exercises: exercises || [] }

    return res.json({ success: true, restDay: false, data: result })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, error: err.message })
  }
}

// Centralized API helper for all backend requests
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Get stored token
function getToken() {
  return localStorage.getItem('token')
}

// Generic fetch wrapper with auth
async function fetchAPI(endpoint, options = {}) {
  const token = getToken()
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    })

    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
      return { error: 'Unauthorized. Redirecting to login...' }
    }

    const data = await response.json()

    if (!response.ok) {
      return { error: data.error || 'An error occurred' }
    }

    return data
  } catch (err) {
    return { error: err.message }
  }
}

// ============ AUTH ENDPOINTS ============

export async function register(email, password, name = '') {
  return fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  })
}

export async function login(email, password) {
  const result = await fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  if (result.token) {
    localStorage.setItem('token', result.token)
  }

  return result
}

export async function getCurrentUser() {
  return fetchAPI('/auth/me', {
    method: 'GET',
  })
}

export async function logout() {
  localStorage.removeItem('token')
}

// ============ USERS ENDPOINTS ============

export async function getProfile() {
  return fetchAPI('/users', {
    method: 'GET',
  })
}

export async function updateProfile(updates) {
  const token = getToken()
  if (!token) return { error: 'Not authenticated' }

  // Get current user ID first
  const userRes = await fetchAPI('/users', { method: 'GET' })
  if (userRes.error) return userRes

  const userId = userRes.data?.id
  if (!userId) return { error: 'Could not find user' }

  return fetchAPI(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
}

// ============ SESSIONS ENDPOINTS ============

export async function getSessions() {
  return fetchAPI('/sessions', {
    method: 'GET',
  })
}

export async function getSessionById(sessionId) {
  return fetchAPI(`/sessions/${sessionId}`, {
    method: 'GET',
  })
}

export async function createSession(day_of_week, is_active = true) {
  return fetchAPI('/sessions', {
    method: 'POST',
    body: JSON.stringify({ day_of_week, is_active }),
  })
}

export async function updateSession(sessionId, updates) {
  return fetchAPI(`/sessions/${sessionId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
}

export async function deleteSession(sessionId) {
  return fetchAPI(`/sessions/${sessionId}`, {
    method: 'DELETE',
  })
}

// ============ EXERCISES ENDPOINTS ============

export async function getExercises() {
  return fetchAPI('/exercises', {
    method: 'GET',
  })
}

export async function getExerciseById(exerciseId) {
  return fetchAPI(`/exercises/${exerciseId}`, {
    method: 'GET',
  })
}

export async function createExercise(exercise_name, muscle_group = '') {
  return fetchAPI('/exercises', {
    method: 'POST',
    body: JSON.stringify({ exercise_name, muscle_group }),
  })
}

export async function updateExercise(exerciseId, updates) {
  return fetchAPI(`/exercises/${exerciseId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
}

export async function deleteExercise(exerciseId) {
  return fetchAPI(`/exercises/${exerciseId}`, {
    method: 'DELETE',
  })
}

// ============ SESSION_EXERCISES ENDPOINTS ============

export async function getSessionExercises() {
  return fetchAPI('/session_exercises', {
    method: 'GET',
  })
}

export async function getSessionExerciseById(id) {
  return fetchAPI(`/session_exercises/${id}`, {
    method: 'GET',
  })
}

export async function addExerciseToSession(session_id, exercise_id) {
  return fetchAPI('/session_exercises', {
    method: 'POST',
    body: JSON.stringify({ session_id, exercise_id }),
  })
}

export async function removeExerciseFromSession(id) {
  return fetchAPI(`/session_exercises/${id}`, {
    method: 'DELETE',
  })
}

// ============ TRACKINGS ENDPOINTS ============

export async function getTrackings() {
  return fetchAPI('/trackings', {
    method: 'GET',
  })
}

export async function getTrackingById(trackingId) {
  return fetchAPI(`/trackings/${trackingId}`, {
    method: 'GET',
  })
}

export async function createTracking(exercise_id, weight, sets, reps, date = new Date().toISOString().split('T')[0], notes = '') {
  return fetchAPI('/trackings', {
    method: 'POST',
    body: JSON.stringify({ exercise_id, weight, sets, reps, date, notes }),
  })
}

export async function updateTracking(trackingId, updates) {
  return fetchAPI(`/trackings/${trackingId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
}

export async function deleteTracking(trackingId) {
  return fetchAPI(`/trackings/${trackingId}`, {
    method: 'DELETE',
  })
}

// ============ UTILITY FUNCTIONS ============

export function isAuthenticated() {
  return !!getToken()
}

export function clearAuth() {
  localStorage.removeItem('token')
}

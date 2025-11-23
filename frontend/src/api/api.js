// Simple API helper to call backend Express API
// By default uses localhost:3000; you can override via VITE_API_BASE
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

async function request(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  })
  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || res.statusText)
  }
  return res.status === 204 ? null : res.json()
}

export const api = {
  // users
  getUsers: () => request('/api/users'),
  createUser: (payload) => request('/api/users', { method: 'POST', body: JSON.stringify(payload) }),

  // programs
  getPrograms: (userId) => request(`/api/programs/${userId}`),
  createProgram: (payload) => request('/api/programs', { method: 'POST', body: JSON.stringify(payload) }),

  // sessions
  getSessions: (programId) => request(`/api/sessions/${programId}`),

  // exercises
  getExercises: (sessionId) => request(`/api/exercises/${sessionId}`),

  // trackings
  createTracking: (payload) => request('/api/tracking', { method: 'POST', body: JSON.stringify(payload) }),
  getTrackingByExercise: (exerciseId) => request(`/api/tracking/${exerciseId}`)
}

export default api

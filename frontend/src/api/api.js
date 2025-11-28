// src/api/api.js

import { updateSession } from "../../../src/api/api"

// Base URL API backend
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

async function request(path, opts = {}) {
  const token = localStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...opts.headers,
  }

  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers,
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || res.statusText)
  }

  return res.status === 204 ? null : res.json()
}

export const api = {
  // auth
  getProfile: () => request('/api/auth/me'),
  login: (payload) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  register: (payload) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) }),

  // users
  createUser: (payload) => request('/api/users', { method: 'POST', body: JSON.stringify(payload) }),
  updateUser: (id, payload) => request(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),

  // programs (backend uses token to scope user)
  // getPrograms: () => request('/api/programs'),
  // createProgram: (payload) => request('/api/programs', { method: 'POST', body: JSON.stringify(payload) }),
  updateSession: (id, payload) => request(`/api/sessions/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),

  // sessions
  getSessions: () => request(`/api/sessions`),
  getTodaySession: () => request(`/api/sessions/today`),
  getDetailSession: (sessionId) => request(`/api/sessions/${sessionId}`),
  // createSession: (payload) => request('/api/sessions', { method: 'POST', body: JSON.stringify(payload) }),

  // exercises
  getExercises: (sessionId) => request('/api/exercises'),
  createExercise: (payload) => request('/api/exercises', { method: 'POST', body: JSON.stringify(payload) }),
  updateExercise: (id, payload) => request(`/api/exercises/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),

  // trackings
  createTracking: (payload) => request('/api/tracking', { method: 'POST', body: JSON.stringify(payload) }),
  getTrackingByExercise: (exerciseId) => request(`/api/tracking/${exerciseId}`),
  getAllTrackings: () => request('/api/tracking'),

  createSession: (payload) =>
  request('/api/sessions', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

addSessionExercise: (payload) =>
  request('/api/session_exercises', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

createExercise: (payload) =>
  request('/api/exercises', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

getExercises: () => request('/api/exercises'),

// session_exercises
addSessionExercise: (payload) =>
  request('/api/session_exercises', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  
deleteSessionExercise: (id) =>
  request(`/api/session_exercises/${id}`, { method: 'DELETE' }),


}

export default api

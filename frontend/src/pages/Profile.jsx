import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import { api } from '../api/api'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [sessions, setSessions] = useState([])
  const [exercises, setExercises] = useState([])
  const [profileForm, setProfileForm] = useState({ email: '', height: '', weight: '' })
  const [newSession, setNewSession] = useState({ session_name: '', day_of_week: '', exercise_ids: [] })
  const [newExerciseName, setNewExerciseName] = useState('')
  const navigate = useNavigate()

  async function loadData() {
    try {
      const res = await api.getProfile()
      const u = res.user
      setUser(u)
      setProfileForm({
        email: u?.email || '',
        height: u?.height || '',
        weight: u?.weight || ''
      })

      const resSessions = await api.getSessions()
      setSessions(resSessions?.data || [])

      const resExercises = await api.getExercises()
      setExercises(resExercises?.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleProfileSave(e) {
    e.preventDefault()
    if (!user) return
    try {
      const updated = await api.updateUser(user.id, profileForm)
      setUser(updated)
      alert('Profile updated')
    } catch (err) {
      console.error(err)
      alert('Failed to update profile')
    }
  }

  async function handleCreateExerciseInline(e) {
    e.preventDefault()
    if (!newExerciseName.trim()) return
    try {
      const res = await api.createExercise({ exercise_name: newExerciseName })
      const created = res.data || res
      setExercises(prev => [...prev, created])
      setNewExerciseName('')
      alert('Exercise added!')
    } catch (err) {
      console.error(err)
      alert('Failed to create exercise')
    }
  }

  async function handleCreateSession(e) {
    e.preventDefault()
    if (!newSession.day_of_week || !newSession.session_name) {
      return alert('Please enter session name and select day.')
    }
    try {
      const res = await api.createSession({
        session_name: newSession.session_name,
        day_of_week: newSession.day_of_week,
        is_active: true
      })
      const session = res.data || res

      // Link exercises ke session baru
      if (newSession.exercise_ids.length > 0) {
        for (const exId of newSession.exercise_ids) {
          await api.addSessionExercise({
            session_id: session.id,
            exercise_id: exId
          })
        }
      }

      setSessions(prev => [session, ...prev])
      setNewSession({ session_name: '', day_of_week: '', exercise_ids: [] })
      alert('Session created successfully!')
    } catch (err) {
      console.error(err)
      alert('Failed to create session')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <h2 className="text-lg font-semibold mb-3">Profile</h2>

      {/* Profile Card */}
      {user ? (
        <Card>
          <div className="font-medium">{user.name}</div>
          <form onSubmit={handleProfileSave} className="mt-2">
            <div className="mb-2">
              <label className="block text-sm">Email</label>
              <input
                className="w-full p-2 border rounded"
                value={profileForm.email}
                onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm">Height (cm)</label>
              <input
                className="w-full p-2 border rounded"
                value={profileForm.height || ''}
                onChange={e => setProfileForm({ ...profileForm, height: e.target.value })}
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm">Weight (kg)</label>
              <input
                className="w-full p-2 border rounded"
                value={profileForm.weight || ''}
                onChange={e => setProfileForm({ ...profileForm, weight: e.target.value })}
              />
            </div>
            <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded">
              Save Profile
            </button>
          </form>
        </Card>
      ) : (
        <p className="text-gray-500">No user data.</p>
      )}

      {/* Sessions List */}
      <h3 className="mt-6 font-semibold">Your Sessions</h3>
      {sessions.map(s => (
        <Card key={s.id}>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">{s.session_name}</div>
              <div className="text-sm text-gray-500 capitalize">
                {s.day_of_week} — {s.is_active ? 'Active' : 'Inactive'}
              </div>
            </div>
            <button
              className="text-sm text-blue-600"
              onClick={() => navigate(`/session/${s.id}`)}
            >
              Detail
            </button>
          </div>
        </Card>
      ))}

      {/* Create New Session */}
      <Card>
        <h3 className="font-semibold mb-2">Create New Session</h3>
        <form onSubmit={handleCreateSession} className="space-y-2">
          <div>
            <label className="block text-sm">Session Name</label>
            <input
              value={newSession.session_name}
              onChange={e => setNewSession({ ...newSession, session_name: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="e.g., Pull Day"
            />
          </div>

          <div>
            <label className="block text-sm">Day of Week</label>
            <select
              className="w-full p-2 border rounded"
              value={newSession.day_of_week}
              onChange={e => setNewSession({ ...newSession, day_of_week: e.target.value })}
            >
              <option value="">Select day</option>
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(d => (
                <option key={d} value={d}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm">Exercises</label>
            <select
              multiple
              value={newSession.exercise_ids}
              onChange={e =>
                setNewSession({
                  ...newSession,
                  exercise_ids: Array.from(e.target.selectedOptions, o => o.value)
                })
              }
              className="w-full p-2 border rounded"
            >
              {exercises.map(ex => (
                <option key={ex.id} value={ex.id}>
                  {ex.exercise_name}
                </option>
              ))}
            </select>
          </div>

          {/* Inline Create Exercise */}
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Add new exercise"
              value={newExerciseName}
              onChange={e => setNewExerciseName(e.target.value)}
              className="p-2 border rounded flex-1"
            />
            <button
              type="button"
              onClick={handleCreateExerciseInline}
              className="bg-blue-500 text-white px-3 py-2 rounded"
            >
              Add
            </button>
          </div>

          <button className="bg-teal-600 text-white px-4 py-2 rounded w-full">
            Create Session
          </button>
        </form>
      </Card>

      {/* Logout */}
      <button
        onClick={() => {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  )
}

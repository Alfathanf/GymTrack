import React, { useEffect, useState } from 'react'
import { api } from '../api/api'
import {  Loader2 } from "lucide-react"

export default function Modal({ show, onClose, onUpdate }) {
  const [exercises, setExercises] = useState([])
  const [newExerciseName, setNewExerciseName] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [newSession, setNewSession] = useState({
    session_name: '',
    day_of_week: '',
    exercise_ids: []
  })

  // ✅ LOAD EXERCISES KETIKA MODAL DIBUKA
  useEffect(() => {
    if (!show) return
    ;(async () => {
      try {
        const res = await api.getExercises()
        setExercises(res.data || [])
      } catch (err) {
        console.error('Failed to fetch exercises:', err)
      }
    })()
  }, [show])

  // ✅ CREATE EXERCISE BARU SECARA INLINE
  async function handleCreateExerciseInline(e) {
    e.preventDefault()
    if (!newExerciseName || isUploading) return
    if (!newExerciseName.trim()) return
    try {
      setIsUploading(true)
      const res = await api.createExercise({ exercise_name: newExerciseName })
      const created = res.data || res
      setExercises(prev => [...prev, created]) // tambahkan ke daftar
      setNewExerciseName('')
      alert('Exercise added!')
    } catch (err) {
      console.error(err)
      alert('Failed to create exercise')
    } finally {
      setIsUploading(false) // ✅ selesai loading
    }
  }

  // ✅ CREATE SESSION BARU
  async function handleCreateSession(e) {
    e.preventDefault()
    if (!newSession || isUploading) return
    if (!newSession.day_of_week || !newSession.session_name) {
      return alert('Please enter session name and select day.')
    }
    try {
      setIsUploading(true)
      const res = await api.createSession({
        session_name: newSession.session_name,
        day_of_week: newSession.day_of_week,
        is_active: false
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

      setNewSession({ session_name: '', day_of_week: '', exercise_ids: [] })
      alert('Session created successfully!')
      if (onUpdate) onUpdate()
      onClose() // tutup modal setelah sukses
    } catch (err) {
      console.error(err)
      alert('Failed to create session')
    } finally {
      setIsUploading(false) // ✅ selesai loading
    }
  }

  if (!show) return null

  return (
<div className="modal-overlay">
  <div className="modal-content">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>

        <h3 className="font-semibold mb-2">Create New Session</h3>

        <form onSubmit={handleCreateSession} className="space-y-2">
          <div>
            <label className="block text-sm">Session Name</label>
            <input
              value={newSession.session_name}
              onChange={e =>
                setNewSession({ ...newSession, session_name: e.target.value })
              }
              className="w-full p-2 border rounded"
              placeholder="e.g., Pull Day"
            />
          </div>

          <div>
            <label className="block text-sm">Day of Week</label>
            <select
              className="w-full p-2 border rounded"
              value={newSession.day_of_week}
              onChange={e =>
                setNewSession({ ...newSession, day_of_week: e.target.value })
              }
            >
              <option value="">Select day</option>
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(
                d => (
                  <option key={d} value={d}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </option>
                )
              )}
            </select>
          </div>

          {/* ✅ Dropdown exercises */}
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
              {exercises.length === 0 ? (
                <option disabled>No exercises found</option>
              ) : (
                exercises.map(ex => (
                  <option key={ex.id} value={ex.id}>
                    {ex.exercise_name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Inline Add Exercise */}
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Add new exercise"
              value={newExerciseName}
              onChange={e => setNewExerciseName(e.target.value)}
              className="p-2 border rounded flex-1"
            />
            <button
              disabled={isUploading}
              type="button"
              onClick={handleCreateExerciseInline}
              className="btn-primary"
            >
              {isUploading ? (
                <Loader2 size={16} className="animate-spin" /> // ikon loading
              ) : "Add" }
            </button>
          </div>

          <button disabled={isUploading} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            {isUploading ? (
                <Loader2 size={16} className="animate-spin" /> // ikon loading
              ) : "Create Session" }
          </button>
        </form>
      </div>
    </div>
  )
}

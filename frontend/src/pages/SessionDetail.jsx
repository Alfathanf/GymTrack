import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Card from '../components/Card'
import { api } from '../api/api'

export default function SessionDetail() {
  const { id } = useParams()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [allExercises, setAllExercises] = useState([]) // semua exercise user
  const [selectedExercise, setSelectedExercise] = useState('') // id exercise yang dipilih

  async function loadSession() {
    try {
      const res = await api.getDetailSession(id)
      setSession(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function loadAllExercises() {
    try {
      const res = await api.getExercises()
      setAllExercises(res.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (!id) return
    loadSession()
    loadAllExercises()
  }, [id])

  // 🔹 Hapus relasi exercise dari session
  async function handleRemoveExercise(sessionExerciseId) {
    if (!window.confirm('Remove this exercise from this session?')) return
    try {
      await api.deleteSessionExercise(sessionExerciseId)
      await loadSession()
    } catch (err) {
      console.error(err)
      alert('Failed to remove exercise')
    }
  }

  // 🔹 Tambah exercise ke session
  async function handleAddExercise(e) {
  e.preventDefault()
  if (!selectedExercise) return alert('Please select an exercise first.')

  try {
    await api.addSessionExercise({
      session_id: id,
      exercise_id: selectedExercise,
    })
    setSelectedExercise('')
    await loadSession()
  } catch (err) {
    console.error(err)
      alert('This exercise is already added to this session.')
  }
}


  if (loading) return <p>Loading...</p>
  if (!session) return <p className="text-gray-500">Session not found.</p>

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">{session.session_name}</h2>
      <p className="text-sm text-gray-500 mb-4">
        {session.day_of_week} — {session.is_active ? 'Active' : 'Inactive'}
      </p>

      {/* 🔹 Daftar Exercise dalam session */}
      {session.exercises?.length === 0 ? (
        <p className="text-gray-500">No exercises in this session.</p>
      ) : (
        session.exercises.map((item) => (
          <Card key={item.id} className="flex justify-between items-center">
            <div className="font-medium">{item.exercises.exercise_name}</div>
            <button
              onClick={() => handleRemoveExercise(item.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Remove
            </button>
          </Card>
        ))
      )}

      {/* 🔹 Form Tambah Exercise */}
      <Card className="mt-4">
        <h3 className="font-semibold mb-2">Add Exercise to Session</h3>
        <form onSubmit={handleAddExercise} className="flex gap-2">
          <select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="p-2 border rounded flex-1"
          >
            <option value="">Select exercise</option>
            {allExercises.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.exercise_name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-teal-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </form>
      </Card>
    </div>
  )
}

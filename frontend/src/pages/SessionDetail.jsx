import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import EditModal from '../components/EditSessionModal'
import { Plus, Trash2, Edit3, Dumbbell, ArrowRight } from "lucide-react"
import Card from '../components/Card'
import api from '../api/api'

export default function SessionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showEditModal, setShowEditModal] = useState(false)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [allExercises, setAllExercises] = useState([]) // semua exercise user
  const [selectedExercise, setSelectedExercise] = useState('') // id exercise yang dipilih
  const [selectedSession, setSelectedSession] = useState(null)

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
  async function handleRemoveExercise(SessionExerciseId) {
    if (!window.confirm('Remove this exercise from this session?')) return
    try {
      await api.deleteSessionExercise(SessionExerciseId)
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

function handleEditSession(session) {
    setSelectedSession(session)
    setShowEditModal(true)
  }


  if (loading) return <p className="text-muted">Loading...</p>
  if (!session) return <p className="text-muted">Session not found.</p>

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="heading-1">{session.session_name}</h2>
          <div className="text-muted">{session.day_of_week} — {session.is_active ? 'Active' : 'Inactive'}</div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => handleEditSession(session)} className="btn-primary"> Edit </button>
        </div>
      </div>

      <EditModal
              show={showEditModal}
              onClose={() => setShowEditModal(false)}
              onUpdate={() => {
                loadSession()
                loadAllExercises()
              }}
              editData={selectedSession}
            />

      {/* Exercises */}
      {session.exercises?.length === 0 ? (
        <p className="text-muted">No exercises in this session.</p>
      ) : (
        session.exercises.map(e => (
          <Card key={e.id} onClick={() => navigate(`/tracking/${e.exercises.id}`)} className="flex justify-between items-center p-4 card-ghost">
            <div className="flex gap-3 items-center">
              <Dumbbell color={'#F5C518'} />
              <div>
                <div className="font-medium">{e.exercises.exercise_name}</div>
              </div>
            </div>

            <div>
              <button onClick={(ev) => { ev.stopPropagation(); handleRemoveExercise(e.id); }} className="btn-red">
                <Trash2 size={16} />
              </button>
            </div>
          </Card>
        ))
      )}

      <Card className="mt-4 p-4">
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
          <button type="submit" className="btn-primary flex items-center gap-2">Add</button>
        </form>
      </Card>
    </div>
  )
}

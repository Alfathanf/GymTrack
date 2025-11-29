import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, Trash2, Edit3, Dumbbell } from "lucide-react"
import Card from '../components/Card'
import Modal from '../components/NewExerciseModal'
import api from '../api/api'

export default function Tracking() {
  const [showModal, setShowModal] = useState(false)
  // const { id } = useParams()
  // const [newExerciseName, setNewExerciseName] = useState('')
  const [exercises, setExercises] = useState([])
  const navigate = useNavigate()
    const [loading, setLoading] = useState(true)


  async function loadExercises() {
    try {
      const res = await api.getExercises()
      setExercises(res?.data || [])
    } catch (err) {
      console.error(err)
      setExercises([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadExercises()
  }, [])

  // async function handleCreateExercise(e) {
  //   e.preventDefault()
  //   if (!newExerciseName.trim()) return
  //   try {
  //     const res = await api.createExercise({ exercise_name: newExerciseName })
  //     const created = res.data || res
  //     setExercises(prev => [created, ...prev])
  //     setNewExerciseName('')
  //   } catch (err) {
  //     console.error(err)
  //     alert('Failed to create Exercise')
  //   }
  // }

   // 🔹 Hapus exercise 
    async function handleRemoveExercise(ExerciseId) {
      if (!window.confirm('Remove this exercise?')) return
      try {
        await api.deleteExercise(ExerciseId)
        await loadExercises()
      } catch (err) {
        console.error(err)
        alert('Failed to remove exercise')
      }
    }

  if (loading) return <p className="text-muted">Loading exercises...</p>

  return (
    <div className="container">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="heading-1">Tracking</h2>
        <div className="heading-2">Track your progress</div>
        </div>
        
        {/* Tombol untuk membuka modal */}
      <button
        onClick={() => setShowModal(true)}
      >
        <button className="btn-primary" onClick={() => {}}>Add Exercise</button>
      </button>

      {/* Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} onUpdate={loadExercises} />
      </div>

      {exercises.length === 0 ? (
        <p className="text-muted">No tracked exercises yet.</p>
      ) : (
        exercises.map(e => (
          <Card key={e.id} onClick={() => navigate(`/tracking/${e.id}`)} className="p-4 mb-3 card-ghost">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{e.exercise_name}</div>
              </div>
              <button
                onClick={(ev) => { ev.stopPropagation(); handleRemoveExercise(e.id); }}
                className="btn-ghost"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </Card>
        ))
      )}

    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, Trash2, Edit3, Dumbbell } from "lucide-react"
import Card from '../components/Card'
import Modal from '../components/NewExerciseModal'
import EditModal from '../components/EditExerciseModal'
import api from '../api/api'

export default function Tracking() {
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [exercises, setExercises] = useState([])
  const navigate = useNavigate()
  const [selectedExercise, setSelectedExercise] = useState(null)
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

  function handleEditExercise(exercise) {  
    setSelectedExercise(exercise)
    setShowEditModal(true)
  }

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

      <button onClick={() => setShowModal(true)} className="btn-primary">Add Exercise</button>

      {/* Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} onUpdate={loadExercises} />
      <EditModal show={showEditModal} onClose={() => setShowEditModal(false)} onUpdate={loadExercises} editData={selectedExercise} />
      </div>

      {exercises.length === 0 ? (
  <p className="text-muted">No tracked exercises yet.</p>
) : (
  exercises.map(e => (
    <Card
      key={e.id}
      onClick={() => navigate(`/tracking/${e.id}`)}
      className="p-4 mb-3 card-ghost cursor-pointer hover:bg-gray-50 transition"
    >
      <div className="flex justify-between items-center">
        {/* Nama Exercise */}
        <div className="font-medium">{e.exercise_name}</div>

        {/* Tombol aksi (Edit & Delete) */}
        <div className="flex items-center gap-2">
          <button
            onClick={(ev) => {  
              ev.stopPropagation()
              handleEditExercise(e)
              setShowEditModal(true)
            }}
            className="text-blue-500 hover:text-blue-700 p-1 rounded"
            title="Edit Exercise"
          >
            <Edit3 size={16} />
          </button>

          <button
            onClick={(ev) => { 
              ev.stopPropagation()
              handleRemoveExercise(e.id)
            }}
            className="text-red-500 hover:text-red-700 p-1 rounded"
            title="Delete Exercise"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </Card>
  ))
)}


    </div>
  )
}

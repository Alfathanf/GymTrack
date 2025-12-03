import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2 } from "lucide-react"
import api from '../api/api'

export default function EditExerciseModal({ show, onClose, onUpdate, editData }) {
  if (!show) return null // kalau show = false, modal tidak muncul

  const { id } = useParams()
  const [exerciseName, setExerciseName] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  // Prefill nama exercise dari data lama
  useEffect(() => {
    if (editData) {
      setExerciseName(editData.exercise_name || '')
    }
  }, [editData])

  async function handleUpdateExercise(e) {
    e.preventDefault()
    if (!exerciseName.trim()) return
    if (isUploading) return

    try {
      setIsUploading(true)
      const res = await api.updateExercise(editData.id, { exercise_name: exerciseName })
      alert('Exercise updated successfully!')
      
      if (onUpdate) onUpdate() // refresh data
      onClose() // tutup modal
    } catch (err) {
      console.error(err)
      alert('Failed to update exercise')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content relative">
        {/* Tombol close */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>

        <h3 className="font-semibold mb-2">Edit Exercise</h3>

        <form onSubmit={handleUpdateExercise} className="mb-4 flex gap-2">
          <input
            value={exerciseName}
            onChange={e => setExerciseName(e.target.value)}
            placeholder="Exercise name"
            className="p-2 border rounded flex-1"
          />
          <button disabled={isUploading} className="btn-primary" type="submit">
            {isUploading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              'Update'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

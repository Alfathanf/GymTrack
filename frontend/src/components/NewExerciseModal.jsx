import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Plus, Trash2, Edit3, Dumbbell } from "lucide-react"
import api from '../api/api'

export default function Modal({ show, onClose, onUpdate}) {
  if (!show) return null // kalau show = false, modal tidak muncul
    const { id } = useParams()
    const [newExerciseName, setNewExerciseName] = useState('')
      const [exercises, setExercises] = useState([])

  async function handleCreateExercise(e) {
      e.preventDefault()
      if (!newExerciseName.trim()) return
      try {
        const res = await api.createExercise({ exercise_name: newExerciseName })
        const created = res.data || res
        setExercises(prev => [created, ...prev])
        setNewExerciseName('')
        alert('Session created successfully!')
      if (onUpdate) onUpdate()
      onClose() // tutup modal setelah sukses
      } catch (err) {
        console.error(err)
        alert('Failed to create Exercise')
      }
    }

  return (
    <div className="modal-overlay">
  <div className="modal-content">
        {/* Tombol close */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          &times;
        </button>

        <h3 className="font-semibold mb-2">Create New Exercise</h3>

        <form onSubmit={handleCreateExercise} className="mb-4 flex gap-2">
                <input
                  value={newExerciseName}
                  onChange={e => setNewExerciseName(e.target.value)}
                  placeholder="New Exercise name"
                  className="p-2 rounded flex-1"
                />
                <button className="btn-primary" type="submit">Add</button>
        </form>
      </div>
    </div>
  )
}

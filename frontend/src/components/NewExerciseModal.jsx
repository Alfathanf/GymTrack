import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {  Loader2 } from "lucide-react"
import api from '../api/api'

export default function Modal({ show, onClose, onUpdate}) {
  if (!show) return null // kalau show = false, modal tidak muncul
    const { id } = useParams()
    const [newExerciseName, setNewExerciseName] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const [exercises, setExercises] = useState([])

  async function handleCreateExercise(e) {
      e.preventDefault()
      if (!newExerciseName.trim()) return
      if (!newExerciseName || isUploading) return
      try {
        setIsUploading(true)
        const res = await api.createExercise({ exercise_name: newExerciseName })
        const created = res.data || res
        setExercises(prev => [created, ...prev])
        setNewExerciseName('')
        alert('Exercise created successfully!')
      if (onUpdate) onUpdate()
      onClose() // tutup modal setelah sukses
      } catch (err) {
        console.error(err)
        alert('Failed to create Exercise')
      } finally {
      setIsUploading(false) // ✅ selesai loading
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
                <button disabled={isUploading} className="btn-primary" type="submit">
                  {isUploading ? (
                <Loader2 size={16} className="animate-spin" /> // ikon loading
              ) : "Add" } </button>
        </form>
      </div>
    </div>
  )
}

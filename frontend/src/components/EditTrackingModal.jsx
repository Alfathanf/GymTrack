import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/api'
import { Loader2 } from "lucide-react"

export default function EditTrackingModal({ show, onClose, onUpdate, editData }) {
  const { exerciseId } = useParams()
  const [form, setForm] = useState({ date: '', sets: '', reps: '', weight: '' })
  const [isUploading, setIsUploading] = useState(false)

  // Prefill data tracking yang sedang diedit
  useEffect(() => {
    if (editData) {
      setForm({
        date: editData.date || '',
        sets: editData.sets || '',
        reps: editData.reps || '',
        weight: editData.weight || ''
      })
    }
  }, [editData])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form || isUploading) return

    if (!form.date || form.sets <= 0 || form.reps <= 0 || form.weight <= 0) {
      alert('Please fill all fields correctly!')
      return
    }

    try {
      setIsUploading(true)
      const payload = {
        exercise_id: exerciseId,
        date: form.date,
        sets: Number(form.sets),
        reps: Number(form.reps),
        weight: Number(form.weight),
      }

      await api.updateTracking(editData.id, payload) // 🔹 ubah tracking berdasarkan ID
      if (onUpdate) onUpdate()
      onClose()
    } catch (err) {
      console.error(err)
      alert('Failed to update tracking')
    } finally {
      setIsUploading(false)
    }
  }

  if (!show) return null

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

        <h3 className="font-semibold mb-2">Edit Tracking</h3>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label className="block text-sm">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              className="p-2 border rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm">Sets</label>
            <input
              type="number"
              value={form.sets}
              onChange={e => setForm({ ...form, sets: e.target.value })}
              className="p-2 border rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm">Reps</label>
            <input
              type="number"
              value={form.reps}
              onChange={e => setForm({ ...form, reps: e.target.value })}
              className="p-2 border rounded w-full"
            />
          </div>
          <div>
            <label className="block text-sm">Weight (kg)</label>
            <input
              type="number"
              value={form.weight}
              onChange={e => setForm({ ...form, weight: e.target.value })}
              className="p-2 border rounded w-full"
            />
          </div>

          <div>
            <button
              disabled={isUploading}
              className="bg-blue-600 text-white px-4 py-2 rounded w-full"
              type="submit"
            >
              {isUploading ? (
                <Loader2 size={16} className="animate-spin inline-block" />
              ) : (
                'Update Tracking'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

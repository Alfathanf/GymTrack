import React, { useEffect, useState } from 'react'
import { api } from '../api/api'
import { Loader2 } from "lucide-react"

export default function EditSessionModal({ show, onClose, onUpdate, editData }) {
  const [exercises, setExercises] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [form, setForm] = useState({
    session_name: '',
    day_of_week: '',
    exercise_ids: []
  })

  // Prefill data dari session yang mau diedit
  useEffect(() => {
    if (editData) {
      setForm({
        session_name: editData.session_name || '',
        day_of_week: editData.day_of_week || '',
        exercise_ids: editData.exercise_ids || []
      })
    }
  }, [editData])

  // Ambil daftar exercise saat modal dibuka
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

  // 🔄 Update Session
  async function handleUpdateSession(e) {
    e.preventDefault()
    if (!form.session_name || !form.day_of_week) {
      return alert('Please fill in all required fields.')
    }

    if (!editData || !editData.id) {
  alert('No session selected to edit!')
  return
}


    try {
      setIsUploading(true)
      // Update session utama
      await api.updateSession(editData.id, {
        session_name: form.session_name,
        day_of_week: form.day_of_week,
      })

      // (Opsional) Update hubungan exercises ↔ session jika diperlukan
      if (form.exercise_ids.length > 0) {
        await api.updateSessionExercises(editData.id, form.exercise_ids)
      }

      alert('Session updated successfully!')
      if (onUpdate) onUpdate()
      onClose()
    } catch (err) {
      console.error(err)
      alert('Failed to update session')
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

        <h3 className="font-semibold mb-2">Edit Session</h3>

        <form onSubmit={handleUpdateSession} className="space-y-3">
          {/* Nama Session */}
          <div>
            <label className="block text-sm">Session Name</label>
            <input
              value={form.session_name}
              onChange={e => setForm({ ...form, session_name: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="e.g., Push Day"
            />
          </div>

          {/* Hari */}
          <div>
            <label className="block text-sm">Day of Week</label>
            <select
              className="w-full p-2 border rounded"
              value={form.day_of_week}
              onChange={e => setForm({ ...form, day_of_week: e.target.value })}
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

          {/* Tombol update */}
          <button
            type="submit"
            disabled={isUploading}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            {isUploading ? (
              <Loader2 size={16} className="animate-spin inline-block" />
            ) : (
              'Edit Session'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

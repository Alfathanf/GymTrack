import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/api'

export default function Modal({ show, onClose, onUpdate }) {
  const { exerciseId } = useParams()
  const [form, setForm] = useState({ date: '', sets: '', reps: '', weight: '' })
  const [history, setHistory] = useState([])

  useEffect(() => {
    if (show && exerciseId) loadHistory()
  }, [show, exerciseId])

  async function loadHistory() {
    try {
      const res = await api.getTrackingByExercise(exerciseId)
      const list = res.data || []
      const sorted = list.sort((a, b) => new Date(b.date) - new Date(a.date))
      setHistory(sorted)
    } catch (err) {
      console.error(err)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.date || form.sets <= 0 || form.reps <= 0 || form.weight <= 0) {
      alert('Please fill all the fields correctly!')
      return
    }

    try {
      const payload = {
        exercise_id: exerciseId,
        date: form.date || new Date().toISOString().split('T')[0],
        sets: Number(form.sets),
        reps: Number(form.reps),
        weight: Number(form.weight),
      }

      await api.createTracking(payload)
      await loadHistory()

      setForm({ date: '', sets: '', reps: '', weight: '' })

      // 🔹 beri tahu parent agar refresh data di luar modal
      if (onUpdate) onUpdate()

      // 🔹 tutup modal setelah sukses
      onClose()

    } catch (err) {
      console.error(err)
      alert('Failed to add tracking')
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

        <h3 className="font-semibold mb-2">Add Tracking</h3>

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
            <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/api'
import Modal from '../components/NewTrackingModal'
import EditModal from '../components/EditTrackingModal'
import { Trash2, Plus, Edit3 } from 'lucide-react'

export default function TrackingDetail() {
  const { exerciseId } = useParams()
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [history, setHistory] = useState([])
  const [selectedTracking, setSelectedTracking] = useState(null)
  const [exerciseName, setExerciseName] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    if (!exerciseId) return
    loadExerciseName()
    loadHistory()
  }, [exerciseId])

  // ✅ Ambil nama exercise
  async function loadExerciseName() {
    try {
      const res = await api.getExerciseById(exerciseId)
      const exercise = res.data || res
      setExerciseName(exercise.exercise_name || 'Unknown Exercise')
    } catch (err) {
      console.error('Failed to load exercise name:', err)
      setExerciseName('Exercise')
    }
  }

  // ✅ Ambil data tracking
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

  function handleEditTracking(tracking) {  
    setSelectedTracking(tracking)
    setShowEditModal(true)
  }


  // 🗑️ Hapus satu tracking record
  async function handleDeleteTracking(id) {
    if (!window.confirm('Are you sure you want to delete this record?')) return
    try {
      await api.deleteTracking(id)
      setHistory(prev => prev.filter(item => item.id !== id)) // hapus langsung dari state
    } catch (err) {
      console.error(err)
      alert('Failed to delete tracking record.')
    }
  }

  // Pagination
  const totalPages = Math.ceil(history.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const paginatedData = history.slice(startIdx, startIdx + itemsPerPage)

  return (
    <div className="min-h-screen p-4 container">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="heading-1">{exerciseName || 'Loading...'}</h2>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Track
        </button>
      </div>

      {/* Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} onUpdate={loadHistory} />
      <EditModal
  show={showEditModal}
  onClose={() => setShowEditModal(false)}
  onUpdate={loadHistory}
  editData={selectedTracking}
/>



      {/* Table */}
      <div className="table-card mb-4">
        {history.length === 0 ? (
          <p className="text-muted-2">No tracking data found for this exercise.</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b text-muted-2">
                <th className="py-2 px-3 text-left">Date</th>
                <th className="py-2 px-3 text-left">Weight</th>
                <th className="py-2 px-3 text-left">Sets</th>
                <th className="py-2 px-3 text-left">Reps</th>
                <th className="py-2 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((r, i) => (
                <tr key={r.id || i} className="border-b hover:bg-gray-50 text-muted-2">
                  <td className="py-2 px-3">{r.date}</td>
                  <td className="py-2 px-3">{r.weight} kg</td>
                  <td className="py-2 px-3">{r.sets}</td>
                  <td className="py-2 px-3">{r.reps}</td>
                  <td className="py-2 px-3 text-center">
                    <button
                      onClick={() => {  
                        handleEditTracking(r)
                        setShowEditModal(true)
                      }}
                      className="text-blue-500 hover:text-blue-700 p-1 rounded"
                      title="Edit record"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteTracking(r.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded"
                      title="Delete record"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mb-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="btn-ghost px-3 py-1 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-muted-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="btn-ghost px-3 py-1 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

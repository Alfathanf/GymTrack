import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api/api'
import Modal from '../components/NewTrackingModal'

// TrackingDetail — show table of tracking data with pagination
export default function TrackingDetail() {
  const { exerciseId } = useParams()
  
    const [showModal, setShowModal] = useState(false)
  const [history, setHistory] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    if (!exerciseId) return
    loadHistory()
  }, [exerciseId])

  async function loadHistory() {
  try {
    const res = await api.getTrackingByExercise(exerciseId)
    const list = res.data || [] // { success, data }

    // 🔹 Urutkan dari tanggal terbaru -> terlama
    const sorted = list.sort((a, b) => new Date(b.date) - new Date(a.date))

    setHistory(sorted)
  } catch (err) {
    console.error(err)
  }
}

  // Pagination logic
  const totalPages = Math.ceil(history.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const paginatedData = history.slice(startIdx, startIdx + itemsPerPage)

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h2 className="text-lg font-semibold mb-3">Tracking Detail</h2>

      <button
              onClick={() => setShowModal(true)}
              className="bg-teal-600 text-white px-4 py-2 rounded"
            >
              Add a New Track
            </button>
      
            {/* Modal */}
            <Modal
              show={showModal}
              onClose={() => setShowModal(false)}
              onUpdate={loadHistory}
            >
            </Modal>

      {/* Table of History */}
      <div className="bg-white p-4 rounded shadow-sm mb-4 overflow-x-auto">
        {history.length === 0 ? (
          <p className="text-gray-500">No tracking data found for this exercise.</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b bg-gray-100 text-left">
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Weight</th>
                <th className="py-2 px-3">Sets</th>
                <th className="py-2 px-3">Reps</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((r, i) => (
                <tr key={r.id || i} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3">{r.date}</td>
                  <td className="py-2 px-3">{r.weight} kg</td>
                  <td className="py-2 px-3">{r.sets}</td>
                  <td className="py-2 px-3">{r.reps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mb-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

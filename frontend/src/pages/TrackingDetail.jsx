import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/api'
import Modal from '../components/NewTrackingModal'
import { Plus } from 'lucide-react'

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
    <div className="min-h-screen p-4 container">
      <div className="flex items-center justify-between mb-4">
        <h2 className="heading-0">Tracking Detail</h2>
        <button onClick={() => setShowModal(true)} className="btn-primary">Add Track</button>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)} onUpdate={loadHistory} />

      <div className="table-card mb-4">
        {history.length === 0 ? (
          <p className="text-muted-2">No tracking data found for this exercise.</p>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b text-muted-2">
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Weight</th>
                <th className="py-2 px-3">Sets</th>
                <th className="py-2 px-3">Reps</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((r, i) => (
                <tr key={r.id || i} className="border-b hover:bg-white/2 text-muted-2">
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

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mb-4">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="btn-ghost px-3 py-1 rounded disabled:opacity-50">Prev</button>
          <span className="text-muted-2">Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="btn-ghost px-3 py-1 rounded disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  )
}

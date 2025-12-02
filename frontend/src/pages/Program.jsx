import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2 } from "lucide-react"
import AddModal from '../components/NewSessionModal'
import Card from '../components/Card'
import { api } from '../api/api'  // ✅ pastikan sesuai export

export default function Tracking() {
  const [showModal, setShowModal] = useState(false)
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

  async function handleToggleActive(sessionId, currentState, dayOfWeek) {
    try {
      const updatedSessions = await Promise.all(
        sessions.map(async (s) => {
          if (s.day_of_week === dayOfWeek && s.id !== sessionId && s.is_active) {
            await api.updateSession(s.id, { is_active: false })
            return { ...s, is_active: false }
          }
          return s
        })
      )
      await api.updateSession(sessionId, { is_active: !currentState })
      const newSessions = updatedSessions.map((s) =>
        s.id === sessionId ? { ...s, is_active: !currentState } : s
      )
      setSessions(newSessions)
    } catch (err) {
      console.error(err)
      alert('Failed to toggle session')
    }
  }

  async function handleRemoveSession(SessionId) {
    if (!window.confirm('Remove this session?')) return
    try {
      await api.deleteSession(SessionId)
      await loadData()
    } catch (err) {
      console.error(err)
      alert('Failed to remove session')
    }
  }

  async function loadData() {
    try {
      const resSessions = await api.getSessions()
      setSessions(resSessions?.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const sortedSessions = [...sessions].sort((a, b) => {
    const indexA = dayOrder.indexOf(a.day_of_week?.toLowerCase())
    const indexB = dayOrder.indexOf(b.day_of_week?.toLowerCase())
    return indexA - indexB
  })

  if (loading) return <p className="text-muted">Loading sessions...</p>

  return (
    <div className="container">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="heading-1">Program</h2>
          <div className="heading-2">Create your program</div>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
         Add Session
        </button>
      </div>

      {/* Modal */}
      <AddModal show={showModal} onClose={() => setShowModal(false)} onUpdate={loadData} />

      {/* Sessions List */}
      {sortedSessions.length === 0 ? (
        <p className="text-muted">No tracked sessions yet.</p>
      ) : (sortedSessions.map((s) => (
        <Card key={s.id} onClick={() => navigate(`/session/${s.id}`)} className="p-4 mb-3 card-ghost">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">{s.session_name}</div>
              <div className="text-muted capitalize">{s.day_of_week}</div>
            </div>

            <div className="flex items-center gap-3">
              <label className="switch" onClick={(ev) => ev.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={!!s.is_active}
                  onChange={() => handleToggleActive(s.id, s.is_active, s.day_of_week)}
                />
                <span className="slider"></span>
              </label>

              <button
                onClick={(ev) => {
                  ev.stopPropagation()
                  handleRemoveSession(s.id)
                }}
                className="btn-red"
                title="Remove session"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </Card>
      )))}
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { Plus, Trash2, Edit3, Dumbbell, LogOut } from "lucide-react"
import Card from '../components/Card'
import AddModal from '../components/NewSessionModal'
import EditModal from '../components/EditProfileModal'
import api from '../api/api'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [sessions, setSessions] = useState([])
  const [exercises, setExercises] = useState([])
  const [profileForm, setProfileForm] = useState({ email: '', height: '', weight: '' })
  const [newSession, setNewSession] = useState({ session_name: '', day_of_week: '', exercise_ids: [] })
  const [newExerciseName, setNewExerciseName] = useState('')
  const navigate = useNavigate()
  // Urutan hari tetap
  const dayOrder = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
  ] 

// Urutkan sesi berdasarkan urutan hari
const sortedSessions = [...sessions].sort((a, b) => {
  const indexA = dayOrder.indexOf(a.day_of_week?.toLowerCase())
  const indexB = dayOrder.indexOf(b.day_of_week?.toLowerCase())
  return indexA - indexB
})


  async function loadData() {
    try {
      const res = await api.getProfile()
      const u = res.user || res.data || res
      setUser(u)
      setProfileForm({
        email: u?.email || '',
        height: u?.height || '',
        weight: u?.weight || ''
      })
      const resSessions = await api.getSessions()
      setSessions(resSessions?.data || resSessions || [])

      const resExercises = await api.getExercises()
      setExercises(resExercises?.data || resExercises || [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // ✅ Toggle session per day — keep only one active per day
  async function handleToggleActive(sessionId, currentState, dayOfWeek) {
    try {
      // 1️⃣ Matikan sesi lain di hari yang sama
      const updatedSessions = await Promise.all(
        sessions.map(async (s) => {
          if (s.day_of_week === dayOfWeek && s.id !== sessionId && s.is_active) {
            await api.updateSession(s.id, { is_active: false })
            return { ...s, is_active: false }
          }
          return s
        })
      )

      // 2️⃣ Toggle sesi yang ditekan
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

  return (
    <div className="min-h-screen p-4 container">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="heading-1">Your Profile</h2>
          <div className="heading-2">Manage your profile and program</div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-ghost" onClick={() => { localStorage.removeItem('token'); window.location.href = '/login' }}>
            <LogOut size={16} color={'#007BFF'} /> 
          </button>
        </div>
      </div>

      {/* Profile Card */}
      {user ? (
        <Card className="card">
          <div className="flex items-center justify-between">
            <div>
              <div className="heading-2">{user.name}</div>
              <div className="text-muted">Height: {user.height || '-'} cm • Weight: {user.weight || '-'} kg</div>
              <div className="text-muted">{user.email}</div>
            </div>
            <div>
              <button onClick={() => setShowEditModal(true)} className="btn-primary">
                <Edit3 size={16} />
              </button>
            </div>
          </div>
        </Card>
      ) : (
        <p className="text-muted">No user data.</p>
      )}

      {/* Sessions List header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="heading-1">Your Program</h3>
        <button onClick={() => setShowModal(true)} className="btn-primary"><Plus size={14} /></button>
      </div>

      <AddModal show={showModal} onClose={() => setShowModal(false)} onUpdate={loadData} />
      <EditModal show={showEditModal} onClose={() => setShowEditModal(false)} onUpdate={loadData} user={user} />

      {sortedSessions.map(s => (
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
                onClick={(ev) => { ev.stopPropagation(); handleRemoveSession(s.id); }}
                className="btn-ghost"
                title="Remove session"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </Card>
      ))}

    </div>
  )
}

import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import AddModal from '../components/NewSessionModal'
import EditModal from '../components/EditProfileModal'
import { api } from '../api/api'
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
      const u = res.user
      setUser(u)
      setProfileForm({
        email: u?.email || '',
        height: u?.height || '',
        weight: u?.weight || ''
      })

      const resSessions = await api.getSessions()
      setSessions(resSessions?.data || [])

      const resExercises = await api.getExercises()
      setExercises(resExercises?.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleProfileSave(e) {
    e.preventDefault()
    if (!user) return
    try {
      const updated = await api.updateUser(user.id, profileForm)
      setUser(updated)
      alert('Profile updated')
    } catch (err) {
      console.error(err)
      alert('Failed to update profile')
    }
  }

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
    <div className="min-h-screen bg-gray-50">
      <h2 className="text-lg font-semibold mb-3">Your Profile</h2>

      {/* Profile Card */}
      {user ? (
        <Card>
      {user ? (
        <Card>
          <div className="bold">{user.name}</div>
          <div className="text-sm text-gray-500">Height: {user.height} cm | Weight: {user.weight} kg</div>
          <div className="text-gray-500">Email: {user.email}</div>
        </Card>
      ) : (
        <p className="text-gray-500">No user data. Create a user via the backend API.</p>
      )}

      {/* Tombol untuk membuka edit modal */}
      <button
        onClick={() => setShowEditModal(true)}
        className="bg-teal-600 text-white px-4 py-2 rounded"
      >
        EditProfile
      </button>

      {/* Modal */}
      <EditModal
  show={showEditModal}
  onClose={() => setShowEditModal(false)}
  onUpdate={loadData}
  user={user} // 🔹 kirim data user
>

      </EditModal>
        </Card>
        
      ) : (
        <p className="text-gray-500">No user data.</p>
      )}

      {/* Sessions List */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Your Program</h2>
{/* Tombol untuk membuka modal */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-teal-600 text-white px-4 py-2 rounded"
      >
        Create a New Session
      </button>

      {/* Modal */}
      <AddModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onUpdate={loadData}
      >
      </AddModal>
      </div>
      
      
      {sortedSessions.map(s => (

        <Card key={s.id}>
          <div className="flex justify-between items-center">
            <div onClick={() => navigate(`/session/${s.id}`)}>
              <div className="font-medium">{s.session_name}</div>
              <div className="text-sm text-gray-500 capitalize">
                {s.day_of_week}
              </div>
              <button
          onClick={(ev) => {
            ev.stopPropagation(); // ⛔ mencegah event klik Card ikut jalan
            handleRemoveSession(s.id);
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          Remove
        </button>
            </div>

            {/* ⚡ Keep existing toggle design */}
            <label className="switch">
              <input
                type="checkbox"
                checked={!!s.is_active}
                onChange={() => handleToggleActive(s.id, s.is_active, s.day_of_week)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </Card>
      ))}

      {/* Logout */}
      <button
        onClick={() => {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  )
}

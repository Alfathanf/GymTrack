import React, { useEffect, useState, useRef } from 'react'
import { Edit3, LogOut, Camera } from "lucide-react"
import Card from '../components/Card'
import EditModal from '../components/EditProfileModal'
import { api } from '../api/api'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [profileForm, setProfileForm] = useState({ email: '', height: '', weight: '' })
  const [previewUrl, setPreviewUrl] = useState('')
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

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
      setPreviewUrl(u?.profile_image || '') // jika ada foto tersimpan
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // 📸 Handle upload foto profil
  async function handleFileChange(e) {
  const file = e.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('photo', file)

  try {
    const res = await api.uploadProfilePhoto(formData)
    if (res?.imageUrl) { // ✅ gunakan field imageUrl dari backend
      setPreviewUrl(res.imageUrl)
      alert('Profile photo updated!')
    }
  } catch (err) {
    console.error(err)
    alert('Failed to upload photo.')
  }
}

  return (
    <div className="min-h-screen p-4 container">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="heading-1">Profile</h2>
          <div className="heading-2">Manage your profile</div>
        </div>
        <button
          className="btn-red"
          onClick={() => {
            localStorage.removeItem('token')
            window.location.href = '/'
          }}
        > Logout
        </button>
      </div>

      {/* Profile Card */}
      {user ? (
        <Card className="relative flex flex-col items-center text-center p-6  ">
          {/* Foto Profil */}
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-blue-500 shadow-md -mt-12 bg-white">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                No Photo
              </div>
            )}

            {/* Tombol upload foto (ikon kamera di pojok bawah) */}
            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-1 right-1 bg-blue-500 text-white p-1.5 rounded-full shadow hover:bg-blue-600"
            >
              <Camera size={16} />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Info User */}
          <div className="mt-4 space-y-1">
            <div className="heading-1">{user.name}</div>
            <div className="text-muted">Email: {user.email}</div>
            <div className="text-muted">Height: {user.height || '-'} cm</div>
            <div className="text-muted">Weight: {user.weight || '-'} kg</div>
          </div>

          {/* Tombol Edit */}
          <div className="mt-4">
            <button
              onClick={() => setShowEditModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Edit3 size={16} /> Edit Profile
            </button>
          </div>
        </Card>
      ) : (
        <p className="text-muted">No user data.</p>
      )}

      {/* Modal Edit */}
      <EditModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdate={loadData}
        user={user}
      />
    </div>
  )
}

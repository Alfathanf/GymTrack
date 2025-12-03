import React, { useEffect, useState } from 'react'
import { api } from '../api/api'

export default function Modal({ show, onClose, onUpdate, user }) {
  const [profileForm, setProfileForm] = useState({ email: '', height: '', weight: '' })

  useEffect(() => {
    if (user && show) {
      setProfileForm({
        email: user.email || '',
        height: user.height || '',
        weight: user.weight || '',
      })
    }
  }, [user, show])

  async function handleProfileSave(e) {
    e.preventDefault()
    if (!user) return
    try {
      await api.updateUser(user.id, profileForm)
      alert('Profile updated!')
      if (onUpdate) onUpdate()
      onClose()
    } catch (err) {
      console.error(err)
      alert('Failed to update profile')
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

        <h3 className="font-semibold mb-2">Edit Your Profile</h3>

        <form onSubmit={handleProfileSave} className="mt-2">
          <div className="mb-2">
            <label className="block text-sm">Email</label>
            <input
              className="w-full p-2 border rounded"
              value={profileForm.email}
              onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm">Height (cm)</label>
            <input
              className="w-full p-2 border rounded"
              value={profileForm.height || ''}
              onChange={e => setProfileForm({ ...profileForm, height: e.target.value })}
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm">Weight (kg)</label>
            <input
              className="w-full p-2 border rounded"
              value={profileForm.weight || ''}
              onChange={e => setProfileForm({ ...profileForm, weight: e.target.value })}
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            Save Profile
          </button>
        </form>
      </div>
    </div>
  )
}

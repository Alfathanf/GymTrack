import React, {useEffect, useState} from 'react'
import Card from '../components/Card'
import { api } from '../api/api'

// Profile — shows user profile and programs; allows editing and creating programs
export default function Profile(){
  const [user, setUser] = useState(null)
  const [sessions, setSessions] = useState([])
  const [editingSessionId, setEditingSessionId] = useState(null)
  const [newSessionName, setNewSessionName] = useState('')
  const [profileForm, setProfileForm] = useState({ email: '', height: '', weight: '' })

  async function loadData(){
    try {
      const res = await api.getProfile()
      const u = res.user
      setUser(u)
      setProfileForm({ email: u?.email || '', height: u?.height || '', weight: u?.weight || '' })
      const resSessions = await api.getSessions()
setSessions(resSessions?.data || [])

    } catch (err) {
      console.error(err)
    }
  }

  useEffect(()=>{ loadData() }, [])

  async function handleProfileSave(e){
    e.preventDefault()
    if (!user) return
    try {
      const updated = await api.updateUser(user.id, profileForm)
      setUser(updated)
      alert('Profile updated')
    } catch (err) { console.error(err); alert('Failed to update profile') }
  }

  async function handleCreateSession(e){
    e.preventDefault()
    if (!newSessionName) return
    try {
      const created = await api.createSession({ day_of_Week: newSessionName, is_active: true })
      setSessions(prev => [created, ...prev])
      setNewSessionName('')
    } catch (err) { console.error(err); alert('Failed to create session') }
  }

  async function handleUpdateSession(id, updates){
    try {
      const updated = await api.updateSession(id, updates)
      setSessions(prev => prev.map(s => s.id === id ? updated : s))
      setEditingSessionId(null)
    } catch (err) { console.error(err); alert('Failed to update session') }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <h2 className="text-lg font-semibold mb-3">Profile</h2>

      {/* profil */}
      {user ? (
        <Card>
          <div className="font-medium">{user.name}</div>
          <form onSubmit={handleProfileSave} className="mt-2">
            <div className="mb-2">
              <label className="block text-sm">Email</label>
              <input className="w-full p-2 border rounded" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} />
            </div>
            <div className="mb-2">
              <label className="block text-sm">Height (cm)</label>
              <input className="w-full p-2 border rounded" value={profileForm.height || ''} onChange={e => setProfileForm({...profileForm, height: e.target.value})} />
            </div>
            <div className="mb-2">
              <label className="block text-sm">Weight (kg)</label>
              <input className="w-full p-2 border rounded" value={profileForm.weight || ''} onChange={e => setProfileForm({...profileForm, weight: e.target.value})} />
            </div>
            <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded">Save Profile</button>
          </form>
        </Card>
      ) : (
        <p className="text-gray-500">No user data.</p>
      )}

      <h3 className="mt-4 font-semibold">Programs</h3>

      {/* <form onSubmit={handleCreateProgram} className="mb-4">
        <input value={newProgramName} onChange={e => setNewProgramName(e.target.value)} placeholder="New program name" className="p-2 border rounded mr-2" />
        <button className="bg-teal-600 text-white px-3 py-2 rounded">Add Program</button>
      </form> */}

      {/* daftar sesi */}
      {sessions.map(s => (
  <Card key={s.id}>
    {editingSessionId === s.id ? (
      <SessionEditor
        session={s}
        onCancel={() => setEditingSessionId(null)}
        onSave={(updates) => handleUpdateSession(s.id, updates)}
      />
    ) : (
      <div className="flex justify-between items-center">
        <div>
          <div className="font-medium">{s.day_of_week}</div>
          <div className="text-sm text-gray-500">{s.is_active ? 'Active' : 'Inactive'}</div>
        </div>
        <div>
          <button
            className="mr-2 text-sm text-blue-600"
            onClick={() => setEditingSessionId(s.id)}
          >
            Edit
          </button>
        </div>
      </div>
    )}
  </Card>
))}


      {/* logout */}
      <button
        onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>

    </div>
  )
}

function SessionEditor({session, onSave, onCancel}){
  const [form, setForm] = useState({ day_of_week: session.day_of_week, is_active: !!session.is_active })
  return (
    <form onSubmit={(e)=>{e.preventDefault(); onSave(form)}} className="w-full">
      <div className="mb-2">
        <input className="w-full p-2 border rounded" value={form.day_of_week} onChange={e => setForm({...form, day_of_week: e.target.value})} />
      </div>
      <div className="flex items-center mb-2">
        <label className="mr-2">Active</label>
        <input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} />
      </div>
      <div className="flex gap-2">
        <button className="bg-teal-600 text-white px-3 py-1 rounded" type="submit">Save</button>
        <button className="px-3 py-1 rounded border" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

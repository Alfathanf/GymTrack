import React, {useEffect, useState} from 'react'
import Card from '../components/Card'
import { api } from '../api/api'

// Profile — shows user profile and programs; allows editing and creating programs
export default function Profile(){
  const [user, setUser] = useState(null)
  const [programs, setPrograms] = useState([])
  const [editingProgramId, setEditingProgramId] = useState(null)
  const [newProgramName, setNewProgramName] = useState('')
  const [profileForm, setProfileForm] = useState({ email: '', height: '', weight: '' })

  async function loadData(){
    try {
      const res = await api.getProfile()
      const u = res.user
      setUser(u)
      setProfileForm({ email: u?.email || '', height: u?.height || '', weight: u?.weight || '' })
      const progs = await api.getPrograms()
      setPrograms(progs || [])
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

  async function handleCreateProgram(e){
    e.preventDefault()
    if (!newProgramName) return
    try {
      const created = await api.createProgram({ program_name: newProgramName, is_active: true })
      setPrograms(prev => [created, ...prev])
      setNewProgramName('')
    } catch (err) { console.error(err); alert('Failed to create program') }
  }

  async function handleUpdateProgram(id, updates){
    try {
      const updated = await api.updateProgram(id, updates)
      setPrograms(prev => prev.map(p => p.id === id ? updated : p))
      setEditingProgramId(null)
    } catch (err) { console.error(err); alert('Failed to update program') }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Profile</h2>

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

      <form onSubmit={handleCreateProgram} className="mb-4">
        <input value={newProgramName} onChange={e => setNewProgramName(e.target.value)} placeholder="New program name" className="p-2 border rounded mr-2" />
        <button className="bg-teal-600 text-white px-3 py-2 rounded">Add Program</button>
      </form>

      {programs.map(p => (
        <Card key={p.id}>
          {editingProgramId === p.id ? (
            <ProgramEditor program={p} onCancel={() => setEditingProgramId(null)} onSave={(updates)=>handleUpdateProgram(p.id, updates)} />
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{p.program_name}</div>
                <div className="text-sm text-gray-500">{p.is_active ? 'Active' : 'Inactive'}</div>
              </div>
              <div>
                <button className="mr-2 text-sm text-blue-600" onClick={() => setEditingProgramId(p.id)}>Edit</button>
              </div>
            </div>
          )}
        </Card>
      ))}

      <button
        onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>

    </div>
  )
}

function ProgramEditor({program, onSave, onCancel}){
  const [form, setForm] = useState({ program_name: program.program_name, is_active: !!program.is_active })
  return (
    <form onSubmit={(e)=>{e.preventDefault(); onSave(form)}} className="w-full">
      <div className="mb-2">
        <input className="w-full p-2 border rounded" value={form.program_name} onChange={e => setForm({...form, program_name: e.target.value})} />
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

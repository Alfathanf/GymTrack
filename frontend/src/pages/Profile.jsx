import React, {useEffect, useState} from 'react'
import Card from '../components/Card'
import { api } from '../api/api'

// Profile — shows user profile and programs (simplified)
export default function Profile(){
  const [user, setUser] = useState(null)
  const [programs, setPrograms] = useState([])

  useEffect(()=>{
    api.getUsers().then(users => setUser(users[0] || null)).catch(()=>{})
    api.getPrograms().then(setPrograms).catch(()=>{})
  }, [])

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Profile</h2>
      {user ? (
        <Card>
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-gray-500">Height: {user.height} cm — Weight: {user.weight} kg</div>
        </Card>
      ) : (
        <p className="text-gray-500">No user data. Create a user via the backend API.</p>
      )}

      <h3 className="mt-4 font-semibold">Programs</h3>
      {programs.map(p => (
        <Card key={p.id}>
          <div className="flex justify-between">
            <div>{p.program_name}</div>
            {p.is_active && <div className="text-teal-600">Active</div>}
          </div>
        </Card>
      ))}
    </div>
  )
}

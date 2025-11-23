import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import { api } from '../api/api'

// Home — list sessions for today and active program
export default function Home(){
  const [sessions, setSessions] = useState([])
  const navigate = useNavigate()

  useEffect(()=>{
    // Example: fetch sessions for a default program (user_id and program selection not implemented here)
    api.getSessions().then(setSessions).catch(err => console.error(err))
  }, [])

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Today's Sessions</h2>
      {sessions.length === 0 ? (
        <p className="text-gray-500">No sessions found for today.</p>
      ) : (
        sessions.map(s => (
          <Card key={s.id} onClick={() => navigate(`/session/${s.id}`)}>
            <div className="flex justify-between">
              <div>
                <div className="font-medium">{s.title}</div>
                <div className="text-sm text-gray-500">{s.day_name}</div>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  )
}

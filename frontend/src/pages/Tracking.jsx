import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import { api } from '../api/api'

// Tracking — list exercises with progress summary
export default function Tracking(){
  const [exercises, setExercises] = useState([])
  const navigate = useNavigate()

  useEffect(()=>{
    // For example simplicity, we could fetch all exercises (or a user's exercises)
    // Here we attempt to fetch sessions then their exercises; in real app we'd fetch user's exercises directly
    api.getPrograms().then(()=>{
      // placeholder - backend should provide endpoint for user exercises
    }).catch(()=>{})
  }, [])

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Tracking</h2>
      {exercises.length === 0 ? (
        <p className="text-gray-500">No tracked exercises yet.</p>
      ) : (
        exercises.map(e => (
          <Card key={e.id} onClick={() => navigate(`/tracking/${e.id}`)}>
            <div className="font-medium">{e.exercise_name}</div>
            <div className="text-sm text-gray-500">Last: {e.last_weight || '-'}</div>
          </Card>
        ))
      )}
    </div>
  )
}

import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import Card from '../components/Card'
import { api } from '../api/api'

// SessionDetail shows exercises for a session
export default function SessionDetail(){
  const { id } = useParams()
  const [exercises, setExercises] = useState([])

  useEffect(()=>{
    if (!id) return
    api.getExercises(id).then(setExercises).catch(err => console.error(err))
  }, [id])

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Session Detail</h2>
      {exercises.map(e => (
        <Card key={e.id}>
          <div className="font-medium">{e.exercise_name}</div>
          <div className="text-sm text-gray-500">Sets: {e.default_sets} × Reps: {e.default_reps} — Weight: {e.default_weight}</div>
        </Card>
      ))}
    </div>
  )
}

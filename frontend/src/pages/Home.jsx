import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import { api } from '../api/api'

// Home — list sessions for today and active program
export default function Home(){
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(()=>{
    // Load active program for user, then sessions for today and their exercises
    async function load(){
      setLoading(true)
      try{
        const programs = await api.getPrograms()
        const active = programs.find(p => p.is_active) || programs[0]
        if (!active) { setSessions([]); return }

        const allSessions = await api.getSessions(active.id)
        // filter by today's day name
        const todayName = new Date().toLocaleString('en-US', { weekday: 'long' })
        const todays = allSessions.filter(s => s.day_name === todayName)

        // fetch exercises for each session
        const sessionsWithExercises = await Promise.all(todays.map(async (s) => {
          const exercises = await api.getExercises(s.id)
          return { ...s, exercises }
        }))

        setSessions(sessionsWithExercises)
      }catch(err){
        console.error(err)
        setSessions([])
      }finally{ setLoading(false) }
    }

    load()
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Today's Sessions</h2>
      {sessions.length === 0 ? (
        <p className="text-gray-500">No sessions found for today.</p>
      ) : (
        sessions.map(s => (
          <Card key={s.id}>
            <div className="mb-2">
              <div className="font-medium">{s.title}</div>
              <div className="text-sm text-gray-500">{s.day_name}</div>
            </div>
            <div>
              {s.exercises && s.exercises.map(e => (
                <div key={e.id} className="border-t pt-2 mt-2">
                  <div className="font-medium">{e.exercise_name}</div>
                  <div className="text-sm text-gray-500">Sets: {e.default_sets} × Reps: {e.default_reps} — Weight: {e.default_weight}</div>
                </div>
              ))}
            </div>
          </Card>
        ))
      )}
    </div>
  )
}

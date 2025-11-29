import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import api from '../api/api'
import { useNavigate } from 'react-router-dom'
import {  Dumbbell, ArrowRight } from 'lucide-react'

export default function Home() {
  const [session, setSession] = useState(null)
  const [restDay, setRestDay] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadTodaySession() {
      setLoading(true)
      try {
        const res = await api.getTodaySession()
        if (res.restDay) {
          setRestDay(true)
          setSession(null)
        } else {
          setRestDay(false)
          setSession(res.data)
        }
      } catch (err) {
        console.error('Failed to load today session:', err)
        setSession(null)
      } finally {
        setLoading(false)
      }
    }

    loadTodaySession()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted">
        Loading today's session...
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 container">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="heading-1">Today's Session</h2>
          <div className="heading-2">A quick overview of your active training</div>
        </div>
      </div>

      {!session || restDay ? (
        <Card className="card">
          <div className="flex flex-col items-start gap-3">
            <div className="heading-2">It's a Rest Day...</div>
            <div className="text-muted">No active session scheduled today...</div>
          </div>
        </Card>
      ) : (
        <>
          <Card className="card">
            <div className="flex items-center justify-between">
              <div>
                <div className="heading-2">{session.session_name}</div>
                <div className="text-accent">{session.day_of_week} • Active</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-muted">{session.exercises?.length || 0} exercises</div>                
              </div>
            </div>
          </Card>

          <h3 className="heading-1 mt-6 mb-3">Exercises</h3>

          {session?.exercises?.length > 0 ? (
            session.exercises.map((item) => (
              <Card key={item.id} onClick={() => navigate(`/tracking/${item.exercises.id}`)} className="mb-3 p-4 card-ghost">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{item.exercises.exercise_name}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted text-sm">Latest</span>
                    <ArrowRight size={18} className="accent" />
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-muted">No exercises in this session.</p>
          )}
        </>
      )}
    </div>
  )
}

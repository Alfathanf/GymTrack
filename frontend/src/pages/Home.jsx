import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import { api } from '../api/api'

export default function Home() {
  const [session, setSession] = useState(null)
  const [restDay, setRestDay] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTodaySession() {
      setLoading(true)
      try {
        const res = await api.getTodaySession() // <— endpoint: /api/sessions/today
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

  if (loading) return <p>Loading...</p>

  return (
    <div className="min-h-screen bg-gray-50">
      <h2 className="text-lg font-semibold mb-3">Today's Session</h2>

      { !session ? (
        <p className="text-gray-500">It's your Rest Day! No active session today...</p>
      ) : (
        <Card>
          <div className="mb-3">
            <div className="font-semibold text-teal-1000">{session.session_name}</div>
              <div className="text-sm text-green-600">{session.day_of_week}</div>
              <div className="text-sm text-green-500">Active Session</div>
          </div>

          {session.exercises.length === 0 ? (
            <p className="text-gray-500">No exercises in this session.</p>
          ) : (
            <div className="space-y-3">
              {session.exercises.map((item) => (
                <div key={item.id} className="border-t pt-2">
                  <div className="font-medium">
                    {item.exercises.exercise_name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
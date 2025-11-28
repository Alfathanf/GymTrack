import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Card from '../components/Card'
import { api } from '../api/api'

export default function SessionDetail() {
  const { id } = useParams()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    ;(async () => {
      try {
        const res = await api.getDetailSession(id)
        setSession(res.data) // <- simpan seluruh objek session
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  if (loading) return <p>Loading...</p>
  if (!session) return <p className="text-gray-500">Session not found.</p>

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">{session.session_name}</h2>
      <p className="text-sm text-gray-500 mb-4">
        {session.day_of_week} — {session.is_active ? 'Active' : 'Inactive'}
      </p>

      {session.exercises?.length === 0 ? (
        <p className="text-gray-500">No exercises in this session.</p>
      ) : (
        session.exercises.map((item) => (
          <Card key={item.id}>
            <div className="font-medium">{item.exercises.exercise_name}</div>
            
          </Card>
        ))
      )}
    </div>
  )
}

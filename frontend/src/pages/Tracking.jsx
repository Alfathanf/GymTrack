import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import { api } from '../api/api'

export default function Tracking() {
  const [exercises, setExercises] = useState([])
  const navigate = useNavigate()
  const [newExerciseName, setNewExerciseName] = useState('')

  async function loadExercises() {
    try {
      const res = await api.getExercises()
      setExercises(res?.data || [])
    } catch (err) {
      console.error(err)
      setExercises([])
    }
  }

  useEffect(() => {
    loadExercises()
  }, [])

  async function handleCreateExercise(e) {
    e.preventDefault()
    if (!newExerciseName.trim()) return
    try {
      const res = await api.createExercise({ exercise_name: newExerciseName })
      const created = res.data || res
      setExercises(prev => [created, ...prev])
      setNewExerciseName('')
    } catch (err) {
      console.error(err)
      alert('Failed to create Exercise')
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Tracking</h2>

      <form onSubmit={handleCreateExercise} className="mb-4">
        <input
          value={newExerciseName}
          onChange={e => setNewExerciseName(e.target.value)}
          placeholder="New Exercise name"
          className="p-2 border rounded mr-2"
        />
        <button className="bg-teal-600 text-white px-3 py-2 rounded">
          Add Exercise
        </button>
      </form>

      {exercises.length === 0 ? (
        <p className="text-gray-500">No tracked exercises yet.</p>
      ) : (
        exercises.map(e => (
          <Card key={e.id} onClick={() => navigate(`/tracking/${e.id}`)}>
            <div className="font-medium">{e.exercise_name}</div>
          </Card>
        ))
      )}
    </div>
  )
}

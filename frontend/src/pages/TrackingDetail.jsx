import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import ChartProgress from '../components/ChartProgress'
import { api } from '../api/api'

// TrackingDetail — show history for an exercise
export default function TrackingDetail(){
  const { exerciseId } = useParams()
  const [history, setHistory] = useState([])
  const [form, setForm] = useState({ date: '', sets_done: '', reps_done: '', weight_used: '' })

  useEffect(()=>{
    if (!exerciseId) return
    api.getTrackingByExercise(exerciseId).then(data => {
      // expected: array of tracking records with date and weight_used
      const points = data.map(r => ({ date: r.date, value: r.weight_used }))
      setHistory(points)
    }).catch(err => console.error(err))
  }, [exerciseId])

  async function handleSubmit(e){
    e.preventDefault()
    try{
      const payload = { exercise_id: exerciseId, date: form.date || new Date().toISOString().split('T')[0], sets_done: Number(form.sets_done), reps_done: Number(form.reps_done), weight_used: Number(form.weight_used) }
      await api.createTracking(payload)
      // refresh
      const data = await api.getTrackingByExercise(exerciseId)
      const points = data.map(r => ({ date: r.date, value: r.weight_used }))
      setHistory(points)
      setForm({ date: '', sets_done: '', reps_done: '', weight_used: '' })
    }catch(err){ console.error(err); alert('Failed to add tracking') }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Tracking Detail</h2>
      <div className="bg-white p-4 rounded shadow-sm mb-4">
        {history.length === 0 ? <p className="text-gray-500">No history found for this exercise.</p> : <ChartProgress dataPoints={history} />}
      </div>

      <div className="bg-white p-4 rounded shadow-sm">
        <h3 className="font-semibold mb-2">Add Tracking</h3>
        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label className="block text-sm">Date</label>
            <input type="date" value={form.date} onChange={e=>setForm({...form, date: e.target.value})} className="p-2 border rounded w-full" />
          </div>
          <div>
            <label className="block text-sm">Sets Done</label>
            <input value={form.sets_done} onChange={e=>setForm({...form, sets_done: e.target.value})} className="p-2 border rounded w-full" />
          </div>
          <div>
            <label className="block text-sm">Reps Done</label>
            <input value={form.reps_done} onChange={e=>setForm({...form, reps_done: e.target.value})} className="p-2 border rounded w-full" />
          </div>
          <div>
            <label className="block text-sm">Weight Used</label>
            <input value={form.weight_used} onChange={e=>setForm({...form, weight_used: e.target.value})} className="p-2 border rounded w-full" />
          </div>
          <div>
            <button className="bg-teal-600 text-white px-4 py-2 rounded">Add</button>
          </div>
        </form>
      </div>
    </div>
  )
}

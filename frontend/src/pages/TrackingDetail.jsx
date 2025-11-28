import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import ChartProgress from '../components/ChartProgress'
import { api } from '../api/api'

// TrackingDetail — show history for an exercise
export default function TrackingDetail(){
  const { exerciseId } = useParams()
  const [history, setHistory] = useState([])
  const [form, setForm] = useState({ date: '', sets: '', reps: '', weight: '' })

  useEffect(()=>{
    if (!exerciseId) return
    api.getTrackingByExercise(exerciseId).then(res => {
  const list = res.data || [] // karena API kamu return { success, data }
  const points = list.map(r => ({ date: r.date, value: r.weight }))
  setHistory(points)
})
.catch(err => console.error(err))
  }, [exerciseId])

  async function handleSubmit(e){
    e.preventDefault()
    try{
      const payload = { exercise_id: exerciseId, date: form.date || new Date().toISOString().split('T')[0], sets: Number(form.sets), reps: Number(form.reps), weight: Number(form.weight) }
      await api.createTracking(payload)
      // refresh
      const data = await api.getTrackingByExercise(exerciseId)
const points = (data.data || []).map(r => ({ date: r.date, value: r.weight }))
      setHistory(points)
      setForm({ date: '', sets: '', reps: '', weight: '' })
    }catch(err){ console.error(err); alert('Failed to add tracking') }
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
            <input value={form.sets} onChange={e=>setForm({...form, sets: e.target.value})} className="p-2 border rounded w-full" />
          </div>
          <div>
            <label className="block text-sm">Reps Done</label>
            <input value={form.reps} onChange={e=>setForm({...form, reps: e.target.value})} className="p-2 border rounded w-full" />
          </div>
          <div>
            <label className="block text-sm">Weight Used</label>
            <input value={form.weight} onChange={e=>setForm({...form, weight: e.target.value})} className="p-2 border rounded w-full" />
          </div>
          <div>
            <button className="bg-teal-600 text-white px-4 py-2 rounded">Add</button>
          </div>
        </form>
      </div>
    </div>
  )
}

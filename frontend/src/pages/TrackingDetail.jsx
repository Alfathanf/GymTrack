import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import ChartProgress from '../components/ChartProgress'
import { api } from '../api/api'

// TrackingDetail — show history for an exercise
export default function TrackingDetail(){
  const { exerciseId } = useParams()
  const [history, setHistory] = useState([])

  useEffect(()=>{
    if (!exerciseId) return
    api.getTrackingByExercise(exerciseId).then(data => {
      // expected: array of tracking records with date and weight_used
      const points = data.map(r => ({ date: r.date, value: r.weight_used }))
      setHistory(points)
    }).catch(err => console.error(err))
  }, [exerciseId])

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Tracking Detail</h2>
      {history.length === 0 ? (
        <p className="text-gray-500">No history found for this exercise.</p>
      ) : (
        <div className="bg-white p-4 rounded shadow-sm">
          <ChartProgress dataPoints={history} />
        </div>
      )}
    </div>
  )
}

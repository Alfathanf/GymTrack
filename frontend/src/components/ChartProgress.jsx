import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// ChartProgress receives `dataPoints` array of {date, value}
export default function ChartProgress({dataPoints = []}){
  const labels = dataPoints.map(d => d.date)
  const data = {
    labels,
    datasets: [
      {
        label: 'Weight Progress',
        data: dataPoints.map(d => d.value),
        fill: false,
        borderColor: '#0ea5a4'
      }
    ]
  }

  return <Line data={data} />
}

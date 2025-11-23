import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import SessionDetail from './pages/SessionDetail'
import Tracking from './pages/Tracking'
import TrackingDetail from './pages/TrackingDetail'
import Profile from './pages/Profile'
import BottomNav from './components/BottomNav'

// App.jsx — routing and layout
export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm p-4">
        <div className="container">
          <Link to="/" className="text-xl font-semibold text-teal-600">GymTrack</Link>
        </div>
      </header>

      <main className="flex-1 container p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/session/:id" element={<SessionDetail />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/tracking/:exerciseId" element={<TrackingDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      <BottomNav />
    </div>
  )
}

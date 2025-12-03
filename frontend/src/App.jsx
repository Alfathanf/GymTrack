import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Program from './pages/Program'
import SessionDetail from './pages/SessionDetail'
import Tracking from './pages/Tracking'
import TrackingDetail from './pages/TrackingDetail'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import BottomNav from './components/BottomNav'
import RequireAuth from './components/RequireAuth'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const location = useLocation()

  // Dengarkan perubahan token di localStorage (misal login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'))
    }

    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Update state token setiap kali user berpindah halaman (terutama setelah login)
  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [location])

  return (
    <div className="app-container">
      {/* Header hanya muncul jika sudah login */}
{token && (
  <header className="app-header">
    <div className="">
      <Link to="/" className="flex items-center gap-2">
        <img
          src="/LOGO_GYMTRACK.png" // 🔹 path relatif dari folder public
          alt="GymTrack Logo"
          className="w-100 h-10 object-contain"
        />
        <span className="heading-1 text-blue-600 font-bold">GymTrack</span>
      </Link>
    </div>
  </header>
)}


      <main className="app-main">
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route
      path="/"
      element={
        <RequireAuth>
          <Home />
        </RequireAuth>
      }
    />
    <Route
      path="/program"
      element={
        <RequireAuth>
          <Program />
        </RequireAuth>
      }
    />
    <Route
      path="/session/:id"
      element={
        <RequireAuth>
          <SessionDetail />
        </RequireAuth>
      }
    />
    <Route
      path="/tracking"
      element={
        <RequireAuth>
          <Tracking />
        </RequireAuth>
      }
    />
    <Route
      path="/tracking/:exerciseId"
      element={
        <RequireAuth>
          <TrackingDetail />
        </RequireAuth>
      }
    />
    <Route
      path="/profile"
      element={
        <RequireAuth>
          <Profile />
        </RequireAuth>
      }
    />
  </Routes>
</main>


      {/* BottomNav hanya muncul jika user sudah login */}
      {token && <BottomNav />}
    </div>
  )
}

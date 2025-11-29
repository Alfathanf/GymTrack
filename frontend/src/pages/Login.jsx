import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LogIn, Mail, Lock } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Login gagal')
      }

      // Simpan token ke localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      // Arahkan ke halaman utama
      navigate('/')
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="card-strong p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 rounded-full" style={{ background: '#f5f5f5' }}>
            <LogIn color={'#007BFF'} />
          </div>
          <h2 className="heading-1 mt-3">Login to GymTrack</h2>
          <div className="heading-2">Welcome Back!</div>
        </div>

        {error && (
          <div className="bg-red-800/50 text-red-200 text-sm p-2 mb-4 rounded">
            {error}
          </div>
        )}

        <div className="mb-4 form">
          <label htmlFor="email" className="label flex items-center gap-2"><Mail size={16} /> Email</label>
          <input
            type="email"
            id="email"
            className=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4 form">
          <label htmlFor="password" className="label flex items-center gap-2"><Lock size={16} /> Password</label>
          <input
            type="password"
            id="password"
            className=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-between text-sm mb-4">
          <div className="text-muted-2">Don't have an account yet?</div>
          <Link to="/register" className="accent hover:underline text-blue-600">Register</Link>
        </div>

        <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
          <LogIn size={16} /> Log in
        </button>
      </form>
    </div>
  )
}

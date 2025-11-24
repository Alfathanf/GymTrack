import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name,email, password })
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-center text-teal-600 mb-6">Sign Up GymTrack</h2>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-2 mb-4 rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
            Nama
          </label>
          <input
            type="name"
            id="name"
            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring focus:ring-teal-300"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring focus:ring-teal-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring focus:ring-teal-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex justify-between text-sm mb-4">
          <a>
            Sudah punya akun?
          <Link to="/login" className="text-teal-600 hover:underline">
            Log in
          </Link>
           </a>
        </div>

        <button
          type="submit"
          className="bg-teal-600 text-white w-full py-2 rounded hover:bg-teal-700 transition"
        >
          Register
        </button>
      </form>
    </div>
  )
}

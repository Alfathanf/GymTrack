import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UserPlus, Mail, Lock, Loader2 } from 'lucide-react'

export default function Register() {
  const [name, setName] = useState('')
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    // ✅ Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/
    if (!passwordRegex.test(password)) {
      setError(
        'Password must be at least 8 characters long and include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character.'
      )
      return
    }

    try {
      setIsUploading(true)
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, height, weight })
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // Simpan token ke localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      // Arahkan ke halaman utama
      navigate('/')
    } catch (err) {
      setError(err.message || 'An error occurred')
    } finally {
      setIsUploading(false) // ✅ selesai loading
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleRegister} className="card-strong p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="p-3 rounded-full" style={{ background: '#f5f5f5' }}>
            <UserPlus color={'#007BFF'} />
          </div>
          <h2 className="heading-1 mt-3">Create Account</h2>
          <div className="heading-2">Start Tracking Your Progress!</div>
        </div>

        {error && (
          <div className="bg-red-800/50 text-red-200 text-sm p-2 mb-4 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 mb-3">
          <div className="form">
            <label className="label">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
        
          <div className="form">
            <label className="label">Height (cm)</label>
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
          </div>
            
          <div className="form">
            <label className="label">Weight (kg)</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>

          <div className="form">
            <label className="label flex items-center gap-2"><Mail size={14} /> Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form">
            <label className="label flex items-center gap-2"><Lock size={14} /> Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <small className="text-muted text-xs">
              Must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character.
            </small>
          </div>
        </div>

        <div className="flex justify-between text-sm mb-4">
          <div className="text-muted-2">Already have an account?</div>
          <Link to="/login" className="accent hover:underline text-blue-600">Log in</Link>
        </div>

        <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
          {isUploading ? (
                <Loader2 size={16} className="animate-spin" /> // ikon loading
              ) : (<UserPlus size={16} /> ) } Register
        </button>
      </form>
    </div>
  )
}

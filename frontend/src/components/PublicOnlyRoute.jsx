import React from 'react'
import { Navigate } from 'react-router-dom'

export default function PublicOnlyRoute({ children }) {
  const token = localStorage.getItem('token')

  // 🔒 Jika sudah login, jangan biarkan akses halaman ini
  if (token) {
    return <Navigate to="/" replace />
  }

  return children
}

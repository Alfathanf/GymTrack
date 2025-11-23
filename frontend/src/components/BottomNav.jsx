import React from 'react'
import { NavLink } from 'react-router-dom'

// Bottom navigation bar component
export default function BottomNav() {
  return (
    <nav className="bg-white border-t p-2 fixed bottom-0 left-0 right-0">
      <div className="container flex justify-around">
        <NavLink to="/" className={({isActive}) => isActive ? 'text-teal-600' : 'text-gray-600'}>Home</NavLink>
        <NavLink to="/tracking" className={({isActive}) => isActive ? 'text-teal-600' : 'text-gray-600'}>Tracking</NavLink>
        <NavLink to="/profile" className={({isActive}) => isActive ? 'text-teal-600' : 'text-gray-600'}>Profile</NavLink>
      </div>
    </nav>
  )
}

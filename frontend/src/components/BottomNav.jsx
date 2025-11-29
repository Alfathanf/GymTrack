import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, ClipboardClock , User } from "lucide-react"


// Bottom navigation bar component
export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <div className="container flex justify-around">
        <NavLink to="/" className={({isActive}) => isActive ? 'text-blue-600' : 'text-white-600'}><Home size={20} /></NavLink>
        <NavLink to="/tracking" className={({isActive}) => isActive ? 'text-blue-600' : 'text-white-600'}><ClipboardClock size={20} /></NavLink>
        <NavLink to="/profile" className={({isActive}) => isActive ? 'text-blue-600' : 'text-white-600'}><User size={20} /></NavLink>
      </div>
    </nav>
  )
}

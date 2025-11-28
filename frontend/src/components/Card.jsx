import React from 'react'

// Simple card component to show an item
export default function Card({children, onClick}){
  return (
    <div onClick={onClick} className="card">
      {children}
    </div>
  )
}

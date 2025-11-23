import React from 'react'

// Simple card component to show an item
export default function Card({children, onClick}){
  return (
    <div onClick={onClick} className="bg-white p-4 rounded shadow-sm mb-3 cursor-pointer">
      {children}
    </div>
  )
}

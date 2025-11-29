import React from 'react'

// Simple card component to show an item
export default function Card({ children, onClick, className = '', style = {} }) {
  return (
    <div
      onClick={onClick}
      className={`card ${className}`}
      style={{ cursor: onClick ? 'pointer' : 'default', ...style }}
    >
      {children}
    </div>
  )
}

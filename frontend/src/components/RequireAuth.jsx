// src/components/RequireAuth.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    // belum login → arahkan ke halaman login
    return <Navigate to="/login" replace />;
  }
  // sudah login → tampilkan halaman tujuan
  return children;
}

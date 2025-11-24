GymTrack — PWA Fitness Tracker (Frontend + Backend)

This repository is a starter scaffold for GymTrack: a Progressive Web App (PWA) frontend (React + Vite) and a Node.js + Express backend API that uses Supabase (Postgres) as the database.

High-level:
- `frontend/` — React + Vite PWA-ready app. Uses React Router and Tailwind for simple styling. Frontend calls your backend API (no direct Supabase calls from frontend).
- `backend/` — Express API with routes and controllers. Connects to Supabase using server-side credentials.

Quick start (PowerShell):

1) Configure Supabase credentials for backend

```powershell
cd backend
copy .env.example .env
# Edit .env and set SUPABASE_URL and SUPABASE_KEY
notepad .env
```

2) Install & run backend

```powershell
cd backend
npm install
npm run dev
```

3) Install & run frontend

```powershell
cd frontend
npm install
npm run dev
```

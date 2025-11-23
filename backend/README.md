# GymTrack Backend

This is the Express backend for GymTrack. It exposes CRUD endpoints for users, programs, sessions, exercises, and trackings. It uses Supabase (Postgres) as the database; credentials should be provided in `.env`.

Quick start:

1. Copy `.env.example` to `.env` and fill `SUPABASE_URL` and `SUPABASE_KEY`.
2. Install dependencies:

```
cd backend
npm install
```

3. Run server:

```
npm run dev
```

The API will run on `http://localhost:3000` by default.

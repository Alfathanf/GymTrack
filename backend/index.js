// import authRoutes from "./routes/auth.js";

const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Mount API routes
app.use('/api/users', require('./routes/users'))
app.use('/api/programs', require('./routes/programs'))
app.use('/api/sessions', require('./routes/sessions'))
app.use('/api/exercises', require('./routes/exercises'))
app.use('/api/tracking', require('./routes/trackings'))
app.use("/api/auth", require('./routes/auth.js'));

// Basic health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`GymTrack API listening on port ${PORT}`)
})

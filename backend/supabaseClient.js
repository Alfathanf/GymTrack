// Supabase client wrapper used by controllers
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn('SUPABASE_URL or SUPABASE_KEY not set. Please copy .env.example to .env and fill values.')
}

const supabase = createClient(SUPABASE_URL || '', SUPABASE_KEY || '')

module.exports = { supabase }

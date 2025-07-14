import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://kqetupdkrxxiwhxrguri.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxZXR1cGRrcnh4aXdoeHJndXJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDU2OTYsImV4cCI6MjA2Nzk4MTY5Nn0.d-Bh-kDI58MylHQ09szYr2WLpGOnkMatKWtBoG1TtAA'

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

export default supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tnzqvakeeofwpcuxaswu.supabase.co'  // <-- correct API URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuenF2YWtlZW9md3BjdXhhc3d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxODQ5OTQsImV4cCI6MjA3NDc2MDk5NH0.fngqoPjuookHl4oeDygddmA-hLmA3mE5POI4juJMadA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

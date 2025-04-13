import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.4/+esm'

// Initialize the Supabase client
const supabaseUrl = 'https://qzkghvczrbohswlcjtdo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6a2dodmN6cmJvaHN3bGNqdGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMTI2MTQsImV4cCI6MjA1NzY4ODYxNH0.OsoSMEVWXFV-iU52na7K2kjdzEL-vTVDtokKZSW1o78'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
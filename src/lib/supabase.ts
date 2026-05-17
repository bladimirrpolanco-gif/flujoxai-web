import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL = 'https://whomyggjgyuxfljuvmqa.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indob215Z2dqZ3l1eGZsanV2bXFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NjQyMjksImV4cCI6MjA5NDM0MDIyOX0.8Up0YHdMAa4b4O2JDgmWOAaiOSTXzcpuAdPHOjhUNxQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

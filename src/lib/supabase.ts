import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Idea {
  id: number
  created_at: string
  user_id: number | null
  content: string | null
  priority_score: number | null
  used_at: string | null
  status: string | null
}

export interface Content {
  id: number
  created_at: string
  user_id: number | null
  idea_id: number | null
  platform: string | null
  type: string | null
  content_url: string | null
  status: string | null
  content: string | null
}
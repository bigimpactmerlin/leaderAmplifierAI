import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types based on your schema
export interface User {
  id: number
  created_at: string
  name: string | null
  email: string | null
  domain: string | null
  linkedin_url: string | null
  facebook_url: string | null
  instagram_url: string | null
  twitter_url: string | null
}

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

export interface Source {
  id: number
  created_at: string
  user_id: number | null
  source_type: string | null
  description: string | null
  url: string | null
  key: string | null
}

// Auth helper functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}
import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, signUp, signIn, signOut, getCurrentUser } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        if (event === 'SIGNED_IN') {
          toast({
            title: "Welcome!",
            description: "Successfully signed in"
          })
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Goodbye!",
            description: "Successfully signed out"
          })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [toast])

  const handleSignUp = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data, error } = await signUp(email, password)
      
      if (error) throw error
      
      toast({
        title: "Success!",
        description: "Account created successfully. Please check your email for verification."
      })
      
      return { data, error: null }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data, error } = await signIn(email, password)
      
      if (error) throw error
      
      return { data, error: null }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setLoading(true)
      const { error } = await signOut()
      if (error) throw error
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    session,
    loading,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    isAuthenticated: !!user
  }
}
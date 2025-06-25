import { useState, useEffect } from 'react'
import { supabase, type User, type UserInsert, type UserUpdate } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setUsers(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users'
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Get user by ID
  const getUserById = async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }

  // Create a new user
  const createUser = async (userData: UserInsert) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single()

      if (error) {
        throw error
      }

      if (data) {
        setUsers(prev => [data, ...prev])
        toast({
          title: "Success",
          description: "User created successfully"
        })
        return data
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }

  // Update a user
  const updateUser = async (id: number, updates: UserUpdate) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      if (data) {
        setUsers(prev => prev.map(user => user.id === id ? data : user))
        if (currentUser && currentUser.id === id) {
          setCurrentUser(data)
        }
        toast({
          title: "Success",
          description: "User updated successfully"
        })
        return data
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }

  // Delete a user
  const deleteUser = async (id: number) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      setUsers(prev => prev.filter(user => user.id !== id))
      if (currentUser && currentUser.id === id) {
        setCurrentUser(null)
      }
      toast({
        title: "Success",
        description: "User deleted successfully"
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }

  // Set current user (for demo purposes)
  const setCurrentUserById = async (id: number) => {
    try {
      const user = await getUserById(id)
      setCurrentUser(user)
      return user
    } catch (err) {
      throw err
    }
  }

  // Login user by email (simplified - no password required as requested)
  const loginUserByEmail = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (error) {
        throw error
      }

      if (data) {
        setCurrentUser(data)
        toast({
          title: "Success",
          description: `Welcome back, ${data.name || 'User'}!`
        })
        return data
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'User not found'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }

  // Logout current user
  const logout = () => {
    setCurrentUser(null)
    toast({
      title: "Success",
      description: "Logged out successfully"
    })
  }

  // Load users on mount and set demo user
  useEffect(() => {
    fetchUsers()
    // Set demo user for development
    setCurrentUserById(1).catch(() => {
      // If no user with ID 1 exists, create a demo user
      createUser({
        name: "Demo User",
        email: "demo@example.com",
        domain: "Technology"
      }).then((user) => {
        if (user) {
          setCurrentUser(user)
        }
      })
    })
  }, [])

  return {
    users,
    currentUser,
    loading,
    error,
    fetchUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    setCurrentUserById,
    loginUserByEmail,
    logout
  }
}
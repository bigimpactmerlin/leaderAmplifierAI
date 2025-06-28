import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export interface IdeaGenerationPrompt {
  id: number
  created_at: string
  name: string | null
  prompt: string | null
  status: string | null
}

export interface IdeaGenerationPromptInsert {
  name?: string | null
  prompt?: string | null
  status?: string | null
}

export interface IdeaGenerationPromptUpdate {
  name?: string | null
  prompt?: string | null
  status?: string | null
}

export function usePrompts() {
  const [prompts, setPrompts] = useState<IdeaGenerationPrompt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch all prompts
  const fetchPrompts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('idea_generation_prompt')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setPrompts(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch prompts'
      setError(errorMessage)
      console.error('Error fetching prompts:', err)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Create a new prompt
  const createPrompt = async (promptData: IdeaGenerationPromptInsert) => {
    try {
      const { data, error } = await supabase
        .from('idea_generation_prompt')
        .insert([{
          ...promptData,
          status: promptData.status || 'active'
        }])
        .select()
        .single()

      if (error) {
        throw error
      }

      if (data) {
        setPrompts(prev => [data, ...prev])
        toast({
          title: "Success",
          description: "Prompt created successfully"
        })
        return data
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create prompt'
      console.error('Error creating prompt:', err)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }

  // Update a prompt
  const updatePrompt = async (id: number, updates: IdeaGenerationPromptUpdate) => {
    try {
      const { data, error } = await supabase
        .from('idea_generation_prompt')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      if (data) {
        setPrompts(prev => prev.map(prompt => prompt.id === id ? data : prompt))
        toast({
          title: "Success",
          description: "Prompt updated successfully"
        })
        return data
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update prompt'
      console.error('Error updating prompt:', err)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }

  // Delete a prompt
  const deletePrompt = async (id: number) => {
    try {
      const { error } = await supabase
        .from('idea_generation_prompt')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      setPrompts(prev => prev.filter(prompt => prompt.id !== id))
      toast({
        title: "Success",
        description: "Prompt deleted successfully"
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete prompt'
      console.error('Error deleting prompt:', err)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }

  // Get active prompt (for use in idea generation)
  const getActivePrompt = () => {
    return prompts.find(prompt => prompt.status === 'active')
  }

  // Set prompt as active (deactivate others)
  const setActivePrompt = async (id: number) => {
    try {
      // First, deactivate all prompts
      await supabase
        .from('idea_generation_prompt')
        .update({ status: 'inactive' })
        .neq('id', 0) // Update all records

      // Then activate the selected prompt
      const { data, error } = await supabase
        .from('idea_generation_prompt')
        .update({ status: 'active' })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      // Update local state
      setPrompts(prev => prev.map(prompt => ({
        ...prompt,
        status: prompt.id === id ? 'active' : 'inactive'
      })))

      toast({
        title: "Success",
        description: "Prompt set as active"
      })

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set active prompt'
      console.error('Error setting active prompt:', err)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }

  // Load prompts on mount
  useEffect(() => {
    fetchPrompts()
  }, [])

  return {
    prompts,
    loading,
    error,
    fetchPrompts,
    createPrompt,
    updatePrompt,
    deletePrompt,
    getActivePrompt,
    setActivePrompt
  }
}
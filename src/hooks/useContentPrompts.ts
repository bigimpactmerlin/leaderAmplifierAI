import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export interface ContentGenerationPrompt {
  id: number
  created_at: string
  name: string | null
  prompt: string | null
  status: string | null
}

export interface ContentGenerationPromptInsert {
  name?: string | null
  prompt?: string | null
  status?: string | null
}

export interface ContentGenerationPromptUpdate {
  name?: string | null
  prompt?: string | null
  status?: string | null
}

export function useContentPrompts() {
  const [contentPrompts, setContentPrompts] = useState<ContentGenerationPrompt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch all content prompts
  const fetchContentPrompts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('cotent_generation_prompt')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setContentPrompts(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch content prompts'
      setError(errorMessage)
      console.error('Error fetching content prompts:', err)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Create a new content prompt
  const createContentPrompt = async (promptData: ContentGenerationPromptInsert) => {
    try {
      const { data, error } = await supabase
        .from('cotent_generation_prompt')
        .insert([{
          ...promptData,
          status: promptData.status || 'inactive'
        }])
        .select()
        .single()

      if (error) {
        throw error
      }

      if (data) {
        setContentPrompts(prev => [data, ...prev])
        toast({
          title: "Success",
          description: "Content prompt created successfully"
        })
        return data
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create content prompt'
      console.error('Error creating content prompt:', err)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }

  // Update a content prompt
  const updateContentPrompt = async (id: number, updates: ContentGenerationPromptUpdate) => {
    try {
      const { data, error } = await supabase
        .from('cotent_generation_prompt')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      if (data) {
        setContentPrompts(prev => prev.map(prompt => prompt.id === id ? data : prompt))
        toast({
          title: "Success",
          description: "Content prompt updated successfully"
        })
        return data
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update content prompt'
      console.error('Error updating content prompt:', err)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }

  // Delete a content prompt
  const deleteContentPrompt = async (id: number) => {
    try {
      const { error } = await supabase
        .from('cotent_generation_prompt')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      setContentPrompts(prev => prev.filter(prompt => prompt.id !== id))
      toast({
        title: "Success",
        description: "Content prompt deleted successfully"
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete content prompt'
      console.error('Error deleting content prompt:', err)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }

  // Get active content prompt (for use in content generation)
  const getActiveContentPrompt = () => {
    return contentPrompts.find(prompt => prompt.status === 'active')
  }

  // Set content prompt as active (deactivate others)
  const setActiveContentPrompt = async (id: number) => {
    try {
      // First, deactivate all content prompts
      await supabase
        .from('cotent_generation_prompt')
        .update({ status: 'inactive' })
        .neq('id', 0) // Update all records

      // Then activate the selected prompt
      const { data, error } = await supabase
        .from('cotent_generation_prompt')
        .update({ status: 'active' })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      // Update local state
      setContentPrompts(prev => prev.map(prompt => ({
        ...prompt,
        status: prompt.id === id ? 'active' : 'inactive'
      })))

      toast({
        title: "Success",
        description: "Content prompt set as active"
      })

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set active content prompt'
      console.error('Error setting active content prompt:', err)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }

  // Load content prompts on mount
  useEffect(() => {
    fetchContentPrompts()
  }, [])

  return {
    contentPrompts,
    loading,
    error,
    fetchContentPrompts,
    createContentPrompt,
    updateContentPrompt,
    deleteContentPrompt,
    getActiveContentPrompt,
    setActiveContentPrompt
  }
}
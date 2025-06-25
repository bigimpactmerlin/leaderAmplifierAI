import { useState, useEffect } from 'react'
import { supabase, type Idea, type IdeaInsert, type IdeaUpdate } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export function useIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch all ideas
  const fetchIdeas = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setIdeas(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch ideas'
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

  // Create a new idea
  const createIdea = async (ideaData: IdeaInsert) => {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .insert([{
          ...ideaData,
          status: ideaData.status || 'new',
          priority_score: ideaData.priority_score || 0.5
        }])
        .select()
        .single()

      if (error) {
        throw error
      }

      if (data) {
        setIdeas(prev => [data, ...prev])
        toast({
          title: "Success",
          description: "Idea created successfully"
        })
        return data
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create idea'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }

  // Update an idea
  const updateIdea = async (id: number, updates: IdeaUpdate) => {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      if (data) {
        setIdeas(prev => prev.map(idea => idea.id === id ? data : idea))
        return data
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update idea'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }

  // Delete an idea
  const deleteIdea = async (id: number) => {
    try {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      setIdeas(prev => prev.filter(idea => idea.id !== id))
      toast({
        title: "Success",
        description: "Idea deleted successfully"
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete idea'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }

  // Mark ideas as used
  const markIdeasAsUsed = async (ideaIds: number[]) => {
    try {
      const { error } = await supabase
        .from('ideas')
        .update({ 
          status: 'used', 
          used_at: new Date().toISOString() 
        })
        .in('id', ideaIds)

      if (error) {
        throw error
      }

      // Update local state
      setIdeas(prev => prev.map(idea => 
        ideaIds.includes(idea.id) 
          ? { ...idea, status: 'used', used_at: new Date().toISOString() }
          : idea
      ))

      toast({
        title: "Success",
        description: `Marked ${ideaIds.length} ideas as used`
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark ideas as used'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }

  // Load ideas on mount
  useEffect(() => {
    fetchIdeas()
  }, [])

  return {
    ideas,
    loading,
    error,
    fetchIdeas,
    createIdea,
    updateIdea,
    deleteIdea,
    markIdeasAsUsed
  }
}
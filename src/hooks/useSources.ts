import { useState, useEffect } from 'react'
import { supabase, type Source, type SourceInsert, type SourceUpdate } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export function useSources() {
  const [sources, setSources] = useState<Source[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch all sources
  const fetchSources = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('sources')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setSources(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch sources'
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

  // Create a new source
  const createSource = async (sourceData: SourceInsert) => {
    try {
      // Determine source type based on URL pattern
      let sourceType = 'Website'
      if (sourceData.url) {
        if (sourceData.url.includes('@')) {
          sourceType = 'Social Media'
        } else if (sourceData.url.includes('feed') || sourceData.url.includes('rss') || sourceData.url.includes('.xml')) {
          sourceType = 'RSS Feed'
        }
      }

      const { data, error } = await supabase
        .from('sources')
        .insert([{
          ...sourceData,
          source_type: sourceType,
          user_id: sourceData.user_id || 1 // Using demo user ID
        }])
        .select()
        .single()

      if (error) {
        throw error
      }

      if (data) {
        setSources(prev => [data, ...prev])
        toast({
          title: "Success",
          description: "Source added successfully"
        })
        return data
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create source'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }

  // Update a source
  const updateSource = async (id: number, updates: SourceUpdate) => {
    try {
      const { data, error } = await supabase
        .from('sources')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      if (data) {
        setSources(prev => prev.map(source => source.id === id ? data : source))
        toast({
          title: "Success",
          description: "Source updated successfully"
        })
        return data
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update source'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }

  // Delete a source
  const deleteSource = async (id: number) => {
    try {
      const { error } = await supabase
        .from('sources')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      setSources(prev => prev.filter(source => source.id !== id))
      toast({
        title: "Success",
        description: "Source deleted successfully"
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete source'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }

  // Toggle source status (active/inactive)
  const toggleSourceStatus = async (id: number) => {
    try {
      const source = sources.find(s => s.id === id)
      if (!source) return

      const newStatus = source.key === 'Active' ? 'Inactive' : 'Active'
      
      const { data, error } = await supabase
        .from('sources')
        .update({ key: newStatus })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      if (data) {
        setSources(prev => prev.map(source => source.id === id ? data : source))
        toast({
          title: "Success",
          description: `Source marked as ${newStatus.toLowerCase()}`
        })
        return data
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle source status'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }

  // Load sources on mount
  useEffect(() => {
    fetchSources()
  }, [])

  return {
    sources,
    loading,
    error,
    fetchSources,
    createSource,
    updateSource,
    deleteSource,
    toggleSourceStatus
  }
}
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

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

export interface ContentInsert {
  user_id?: number | null
  idea_id?: number | null
  platform?: string | null
  type?: string | null
  content_url?: string | null
  status?: string | null
  content?: string | null
}

export interface ContentUpdate {
  user_id?: number | null
  idea_id?: number | null
  platform?: string | null
  type?: string | null
  content_url?: string | null
  status?: string | null
  content?: string | null
}

export function useContents() {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch all contents
  const fetchContents = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('contents')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setContents(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch contents'
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

  // Create new content
  const createContent = async (contentData: ContentInsert) => {
    try {
      const { data, error } = await supabase
        .from('contents')
        .insert([{
          ...contentData,
          status: contentData.status || 'draft'
        }])
        .select()
        .single()

      if (error) {
        throw error
      }

      if (data) {
        setContents(prev => [data, ...prev])
        toast({
          title: "Success",
          description: "Content created successfully"
        })
        return data
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create content'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }

  // Update content
  const updateContent = async (id: number, updates: ContentUpdate) => {
    try {
      const { data, error } = await supabase
        .from('contents')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw error
      }

      if (data) {
        setContents(prev => prev.map(content => content.id === id ? data : content))
        toast({
          title: "Success",
          description: "Content updated successfully"
        })
        return data
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update content'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }

  // Delete content
  const deleteContent = async (id: number) => {
    try {
      const { error } = await supabase
        .from('contents')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      setContents(prev => prev.filter(content => content.id !== id))
      toast({
        title: "Success",
        description: "Content deleted successfully"
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete content'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }

  // Publish content to selected platforms
  const publishContent = async (contentIds: number[], platforms: string[]) => {
    try {
      // For demo purposes, we'll just update the status to 'published'
      // In a real app, this would integrate with actual social media APIs
      const { error } = await supabase
        .from('contents')
        .update({ status: 'published' })
        .in('id', contentIds)

      if (error) {
        throw error
      }

      // Update local state
      setContents(prev => prev.map(content => 
        contentIds.includes(content.id) 
          ? { ...content, status: 'published' }
          : content
      ))

      toast({
        title: "Success",
        description: `Published ${contentIds.length} content items to ${platforms.join(", ")}`
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to publish content'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }

  // Generate more content (placeholder function)
  const generateMoreContent = async () => {
    try {
      // This is a placeholder - in a real app, this would call your AI content generation API
      const sampleContents = [
        {
          content: "AI is revolutionizing healthcare with predictive analytics and personalized treatment plans.",
          platform: "LinkedIn",
          type: "Article",
          status: "draft",
          user_id: 1
        },
        {
          content: "The future of remote work: 5 trends shaping the digital workplace",
          platform: "Twitter",
          type: "Tweet",
          status: "draft",
          user_id: 1
        },
        {
          content: "Sustainable fashion brands are leading the way in eco-conscious consumer choices",
          platform: "Instagram",
          type: "Post",
          status: "draft",
          user_id: 1
        }
      ]

      for (const contentData of sampleContents) {
        await createContent(contentData)
      }

      toast({
        title: "Success",
        description: `Generated ${sampleContents.length} new content pieces`
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate content'
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
      throw err
    }
  }

  // Load contents on mount
  useEffect(() => {
    fetchContents()
  }, [])

  return {
    contents,
    loading,
    error,
    fetchContents,
    createContent,
    updateContent,
    deleteContent,
    publishContent,
    generateMoreContent
  }
}
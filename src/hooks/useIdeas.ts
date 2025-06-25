import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, type Idea } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'

export const useIdeas = () => {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['ideas', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        throw new Error(error.message)
      }
      
      return data as Idea[]
    },
    enabled: !!user // Only run query if user is authenticated
  })
}

export const useCreateIdea = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { user } = useAuth()
  
  return useMutation({
    mutationFn: async (idea: Omit<Idea, 'id' | 'created_at'>) => {
      if (!user) {
        throw new Error('User must be authenticated')
      }

      const ideaWithUser = {
        ...idea,
        user_id: parseInt(user.id) // Convert auth user id to number for your schema
      }

      const { data, error } = await supabase
        .from('ideas')
        .insert([ideaWithUser])
        .select()
        .single()
      
      if (error) {
        throw new Error(error.message)
      }
      
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] })
      toast({
        title: "Success",
        description: "Idea created successfully"
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  })
}

export const useUpdateIdea = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: number, updates: Partial<Idea> }) => {
      const { data, error } = await supabase
        .from('ideas')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        throw new Error(error.message)
      }
      
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] })
      toast({
        title: "Success",
        description: "Idea updated successfully"
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  })
}

export const useDeleteIdea = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', id)
      
      if (error) {
        throw new Error(error.message)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] })
      toast({
        title: "Success",
        description: "Idea deleted successfully"
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  })
}
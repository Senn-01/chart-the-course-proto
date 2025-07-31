import { createClient } from '@/lib/supabase/server'
import { TerritoriesContent } from './territories-content'

export default async function TerritoriesPage() {
  const supabase = await createClient()
  
  // Fetch user's ideas
  const { data: ideas, error } = await supabase
    .from('ideas')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching ideas:', error)
  }

  return <TerritoriesContent initialIdeas={ideas || []} />
}
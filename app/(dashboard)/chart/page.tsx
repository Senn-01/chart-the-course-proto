import { createClient } from '@/lib/supabase/server'
import { ChartContent } from './chart-content'

export default async function ChartPage() {
  const supabase = await createClient()
  
  // Fetch user's initiatives
  const { data: initiatives, error } = await supabase
    .from('initiatives')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching initiatives:', error)
  }

  return <ChartContent initialInitiatives={initiatives || []} />
}
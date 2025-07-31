import { createClient } from '@/lib/supabase/server'
import { ExpeditionContent } from './expedition-content'

export default async function ExpeditionPage() {
  const supabase = await createClient()
  
  // Fetch today's sessions
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const { data: sessions } = await supabase
    .from('work_sessions')
    .select('*')
    .gte('started_at', today.toISOString())
    .order('started_at', { ascending: false })

  // Fetch active initiatives for selection
  const { data: initiatives } = await supabase
    .from('initiatives')
    .select('*')
    .eq('status', 'active')
    .order('name')

  return <ExpeditionContent 
    initialSessions={sessions || []} 
    initiatives={initiatives || []}
  />
}
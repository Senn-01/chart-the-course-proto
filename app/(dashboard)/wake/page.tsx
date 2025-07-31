import { createClient } from '@/lib/supabase/server'
import { WakeContent } from './wake-content'

export default async function WakePage() {
  const supabase = await createClient()
  
  // Fetch analytics data
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  // Fetch work sessions
  const { data: sessions } = await supabase
    .from('work_sessions')
    .select('*')
    .gte('started_at', thirtyDaysAgo.toISOString())
    .order('started_at', { ascending: true })

  // Fetch initiatives with counts
  const { data: initiatives } = await supabase
    .from('initiatives')
    .select('*, work_sessions(count)')

  // Fetch ideas count by status
  const { data: ideas } = await supabase
    .from('ideas')
    .select('status')

  // Process data for analytics
  const analytics = {
    totalSessions: sessions?.length || 0,
    totalHours: sessions?.reduce((total, session) => {
      if (session.ended_at) {
        const duration = new Date(session.ended_at).getTime() - new Date(session.started_at).getTime()
        return total + duration / 1000 / 60 / 60
      }
      return total
    }, 0) || 0,
    completedInitiatives: initiatives?.filter(i => i.status === 'completed').length || 0,
    activeInitiatives: initiatives?.filter(i => i.status === 'active').length || 0,
    ideasByStatus: {
      captured: ideas?.filter(i => i.status === 'captured').length || 0,
      explored: ideas?.filter(i => i.status === 'explored').length || 0,
      archived: ideas?.filter(i => i.status === 'archived').length || 0,
    },
  }

  return <WakeContent 
    sessions={sessions || []} 
    initiatives={initiatives || []}
    analytics={analytics}
  />
}
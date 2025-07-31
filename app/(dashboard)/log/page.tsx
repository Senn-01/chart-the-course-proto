import { createClient } from '@/lib/supabase/server'
import { LogContent } from './log-content'

export default async function LogPage() {
  const supabase = await createClient()
  
  // Fetch recent log entries
  const { data: entries } = await supabase
    .from('log_entries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(30)

  // Check if today's entry exists
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const todaysEntry = entries?.find(entry => {
    const entryDate = new Date(entry.created_at)
    entryDate.setHours(0, 0, 0, 0)
    return entryDate.getTime() === today.getTime()
  })

  return <LogContent 
    initialEntries={entries || []} 
    todaysEntry={todaysEntry}
  />
}
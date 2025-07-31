import { createClient } from '@/lib/supabase/server'
import { CompassContent } from './compass-content'

export default async function CompassPage() {
  const supabase = await createClient()
  
  // Fetch user's vision document
  const { data: visionDocument } = await supabase
    .from('vision_documents')
    .select('*')
    .single()

  // Fetch vision chats
  const { data: chats } = await supabase
    .from('vision_chats')
    .select('*')
    .order('created_at', { ascending: false })

  return <CompassContent 
    initialVision={visionDocument} 
    initialChats={chats || []} 
  />
}
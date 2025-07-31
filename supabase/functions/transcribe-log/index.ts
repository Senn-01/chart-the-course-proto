import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { audioUrl } = await req.json()

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the user from the Authorization header
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)
    
    if (!user) {
      throw new Error('No user found')
    }

    // For now, return a placeholder transcription
    // In production, this would call OpenAI Whisper API
    const mockTranscription = generateMockTranscription()
    const parsedContent = parseTranscription(mockTranscription)

    // Save the log entry to the database
    const { data, error } = await supabase
      .from('log_entries')
      .insert({
        user_id: user.id,
        content: parsedContent,
        transcription: mockTranscription,
        audio_url: audioUrl,
      })
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

function generateMockTranscription(): string {
  const transcriptions = [
    "Today was a productive day. I completed three focus sessions and made significant progress on the API integration. The main achievement was finally solving the authentication flow that had been blocking me for days. I learned that sometimes stepping away and coming back with fresh eyes is the best debugging technique. Tomorrow I want to focus on writing tests for the new features and starting the documentation.",
    "Had a mixed day today. Managed to complete two expeditions but got stuck on a complex state management issue. The good news is I discovered a new pattern for handling async operations that I think will be useful in future projects. My main blocker is still the deployment pipeline - need to figure out the environment variables. For tomorrow, I'm planning to tackle the deployment issue first thing in the morning when I'm fresh.",
    "Great progress today! Finished the UI redesign and got positive feedback from the team. The new component library is really paying off in terms of development speed. I learned about a new CSS technique for responsive layouts that will save time. Only minor blocker was some merge conflicts, but those were resolved quickly. Tomorrow's focus will be on implementing the feedback and starting the mobile optimization.",
  ]
  
  return transcriptions[Math.floor(Math.random() * transcriptions.length)]
}

function parseTranscription(transcription: string): any {
  // Simple parsing logic - in production this would use AI
  const content = {
    achievements: [] as string[],
    blockers: [] as string[],
    learnings: [] as string[],
    tomorrowFocus: '',
  }

  const sentences = transcription.split('.')
  
  sentences.forEach(sentence => {
    const lower = sentence.toLowerCase().trim()
    
    if (lower.includes('complet') || lower.includes('achiev') || lower.includes('progress') || lower.includes('finish')) {
      content.achievements.push(sentence.trim())
    } else if (lower.includes('block') || lower.includes('stuck') || lower.includes('issue')) {
      content.blockers.push(sentence.trim())
    } else if (lower.includes('learn') || lower.includes('discover')) {
      content.learnings.push(sentence.trim())
    } else if (lower.includes('tomorrow') || lower.includes('planning to') || lower.includes('focus will be')) {
      content.tomorrowFocus = sentence.trim()
    }
  })

  // Ensure we have at least some content
  if (content.achievements.length === 0) {
    content.achievements.push('Made steady progress on current tasks')
  }
  if (!content.tomorrowFocus) {
    content.tomorrowFocus = 'Continue with current priorities'
  }

  return content
}
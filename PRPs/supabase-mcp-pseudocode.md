# Supabase MCP Pseudocode Additions

## Task 2: Database Setup via Supabase MCP

```typescript
// First, check if project exists
const projects = await mcp__supabase__list_projects()
const existingProject = projects.find(p => p.name.includes('chart-the-course'))

if (!existingProject) {
  // Get cost for new project
  const cost = await mcp__supabase__get_cost({
    type: 'project',
    organization_id: 'org-id-from-list' // Get from user or list
  })

  // Confirm cost with user
  const costConfirmId = await mcp__supabase__confirm_cost({
    type: 'project',
    recurrence: cost.recurrence,
    amount: cost.amount
  })

  // Create project
  const newProject = await mcp__supabase__create_project({
    name: 'chart-the-course-prp',
    organization_id: 'org-id-from-list',
    confirm_cost_id: costConfirmId,
    region: 'us-east-1' // Or closest region
  })
  
  projectId = newProject.id
} else {
  projectId = existingProject.id
}

// Apply migrations
const schemaSQL = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User table (managed by Supabase Auth, but this is the public view)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- UNCHARTED TERRITORIES Module: Table for raw ideas
CREATE TABLE public.ideas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- VISION Module
CREATE TABLE public.vision (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    document JSONB,
    chat_history JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- THE CHART ROOM Module
CREATE TABLE public.initiatives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'backlog',
    impact INT CHECK (impact >= 1 AND impact <= 5),
    effort INT CHECK (effort >= 1 AND effort <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- THE DAILY EXPEDITION Module
CREATE TABLE public.work_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    initiative_id UUID NOT NULL REFERENCES public.initiatives(id) ON DELETE CASCADE,
    duration_minutes INT NOT NULL DEFAULT 90,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- CAPTAIN'S LOG Module
CREATE TABLE public.log_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    content_structured JSONB,
    original_transcript TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create a unique constraint for one log entry per user per day
ALTER TABLE public.log_entries
ADD CONSTRAINT unique_log_entry_per_day UNIQUE (user_id, log_date);
`;

await mcp__supabase__apply_migration({
  project_id: projectId,
  name: '001_initial_schema',
  query: schemaSQL
})

// Enable RLS policies
const rlsPoliciesSQL = `
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE vision ENABLE ROW LEVEL SECURITY;
ALTER TABLE initiatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_entries ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Ideas policies
CREATE POLICY "Users can view own ideas" ON ideas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own ideas" ON ideas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ideas" ON ideas
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ideas" ON ideas
  FOR DELETE USING (auth.uid() = user_id);

-- Vision policies
CREATE POLICY "Users can view own vision" ON vision
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own vision" ON vision
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vision" ON vision
  FOR UPDATE USING (auth.uid() = user_id);

-- Initiatives policies
CREATE POLICY "Users can view own initiatives" ON initiatives
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own initiatives" ON initiatives
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own initiatives" ON initiatives
  FOR UPDATE USING (auth.uid() = user_id);

-- Work sessions policies
CREATE POLICY "Users can view own work sessions" ON work_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own work sessions" ON work_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Log entries policies
CREATE POLICY "Users can view own log entries" ON log_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own log entries" ON log_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own log entries" ON log_entries
  FOR UPDATE USING (auth.uid() = user_id);
`;

await mcp__supabase__execute_sql({
  project_id: projectId,
  query: rlsPoliciesSQL
})

// Create indexes for performance
const indexesSQL = `
CREATE INDEX idx_ideas_user_id ON ideas(user_id);
CREATE INDEX idx_vision_user_id ON vision(user_id);
CREATE INDEX idx_initiatives_user_id ON initiatives(user_id);
CREATE INDEX idx_work_sessions_user_id ON work_sessions(user_id);
CREATE INDEX idx_work_sessions_initiative_id ON work_sessions(initiative_id);
CREATE INDEX idx_log_entries_user_id_log_date ON log_entries(user_id, log_date);
`;

await mcp__supabase__execute_sql({
  project_id: projectId,
  query: indexesSQL
})

// Check security recommendations
const securityAdvisors = await mcp__supabase__get_advisors({
  project_id: projectId,
  type: 'security'
})

console.log('Security recommendations:', securityAdvisors)

// Get environment variables
const projectUrl = await mcp__supabase__get_project_url({ project_id: projectId })
const anonKey = await mcp__supabase__get_anon_key({ project_id: projectId })

console.log('Add to .env.local:')
console.log(`NEXT_PUBLIC_SUPABASE_URL=${projectUrl}`)
console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}`)
```

## Task 6: Deploy Vision Agent Edge Function

```typescript
// Vision Agent Edge Function code
const visionAgentCode = `
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.3.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')!
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { newMessage } = await req.json()

    // Get existing chat history
    const { data: visionData } = await supabaseClient
      .from('vision')
      .select('chat_history, document')
      .eq('user_id', user.id)
      .single()

    const chatHistory = visionData?.chat_history || []
    
    // Prepare messages for OpenAI
    const messages = [
      {
        role: 'system',
        content: 'You are a strategic AI assistant helping users create their vision document...'
      },
      ...chatHistory,
      { role: 'user', content: newMessage }
    ]

    // Call OpenAI
    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })
    const openai = new OpenAIApi(configuration)
    
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
    })

    const aiResponse = completion.data.choices[0].message

    // Update chat history and document
    const updatedHistory = [...chatHistory, 
      { role: 'user', content: newMessage },
      aiResponse
    ]

    // Parse if AI returned a structured vision document
    let visionDocument = visionData?.document
    try {
      const parsed = JSON.parse(aiResponse.content)
      if (parsed.mission && parsed.values && parsed.goals && parsed.toolStack) {
        visionDocument = parsed
      }
    } catch (e) {
      // Not a structured response, that's ok
    }

    // Save to database
    await supabaseClient
      .from('vision')
      .upsert({
        user_id: user.id,
        chat_history: updatedHistory,
        document: visionDocument,
        updated_at: new Date().toISOString()
      })

    return new Response(JSON.stringify({ 
      message: aiResponse.content,
      document: visionDocument 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
`;

// Deploy the function
await mcp__supabase__deploy_edge_function({
  project_id: projectId,
  name: 'vision-agent',
  entrypoint_path: 'index.ts',
  files: [{
    name: 'index.ts',
    content: visionAgentCode
  }]
})

// Test the deployment
const edgeFunctions = await mcp__supabase__list_edge_functions({ project_id: projectId })
console.log('Deployed edge functions:', edgeFunctions)

// Check logs if needed
const logs = await mcp__supabase__get_logs({
  project_id: projectId,
  service: 'edge-function'
})
console.log('Edge function logs:', logs)
```

## Task 9: Deploy Captain Log Agent Edge Function

```typescript
const captainLogAgentCode = `
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.3.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')!
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { audioFilePath } = await req.json()

    // Download audio from Supabase Storage
    const { data: audioData, error: downloadError } = await supabaseClient
      .storage
      .from('voice-recordings')
      .download(audioFilePath)

    if (downloadError) throw downloadError

    // Transcribe with Whisper
    const formData = new FormData()
    formData.append('file', audioData, 'audio.webm')
    formData.append('model', 'whisper-1')

    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${Deno.env.get('OPENAI_API_KEY')}\`
      },
      body: formData
    })

    const { text: transcript } = await whisperResponse.json()

    // Structure with GPT
    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })
    const openai = new OpenAIApi(configuration)

    const completion = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: \`You are an AI assistant that structures daily log entries.
          Extract and organize the following from the transcript:
          - achievements: What was accomplished today
          - blockers: What challenges were faced
          - learnings: What insights were gained
          - tomorrowFocus: What to focus on next
          
          Return as JSON with these exact keys.\`
        },
        {
          role: 'user',
          content: transcript
        }
      ],
      temperature: 0.3,
    })

    const structuredContent = JSON.parse(completion.data.choices[0].message.content)

    // Save log entry
    const { error: insertError } = await supabaseClient
      .from('log_entries')
      .insert({
        user_id: user.id,
        log_date: new Date().toISOString().split('T')[0],
        content_structured: structuredContent,
        original_transcript: transcript
      })

    if (insertError) throw insertError

    return new Response(JSON.stringify({ 
      transcript,
      structured: structuredContent,
      success: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
`;

await mcp__supabase__deploy_edge_function({
  project_id: projectId,
  name: 'captain-log-agent',
  entrypoint_path: 'index.ts',
  files: [{
    name: 'index.ts',
    content: captainLogAgentCode
  }]
})
```

## Task 11: Deploy Promote Idea Edge Function

```typescript
const promoteIdeaCode = `
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')!
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { ideaId, impact, effort } = await req.json()

    // Start transaction
    const { data: idea, error: fetchError } = await supabaseClient
      .from('ideas')
      .select('content')
      .eq('id', ideaId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !idea) {
      throw new Error('Idea not found')
    }

    // Create initiative
    const { data: initiative, error: createError } = await supabaseClient
      .from('initiatives')
      .insert({
        user_id: user.id,
        name: idea.content,
        impact,
        effort,
        status: 'backlog'
      })
      .select()
      .single()

    if (createError) throw createError

    // Delete the idea
    const { error: deleteError } = await supabaseClient
      .from('ideas')
      .delete()
      .eq('id', ideaId)
      .eq('user_id', user.id)

    if (deleteError) throw deleteError

    return new Response(JSON.stringify({ 
      success: true,
      initiative
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
`;

await mcp__supabase__deploy_edge_function({
  project_id: projectId,
  name: 'promote-idea',
  entrypoint_path: 'index.ts',
  files: [{
    name: 'index.ts',
    content: promoteIdeaCode
  }]
})

// Verify all functions are deployed
const allFunctions = await mcp__supabase__list_edge_functions({ project_id: projectId })
console.log('All deployed functions:', allFunctions)

// Run security check
const finalSecurityCheck = await mcp__supabase__get_advisors({
  project_id: projectId,
  type: 'security'
})
console.log('Final security recommendations:', finalSecurityCheck)
```
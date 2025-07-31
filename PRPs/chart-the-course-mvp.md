name: "Chart The Course MVP - Full Implementation"
description: |

## Purpose
Build the complete MVP of Chart The Course - a minimalist SaaS web application for knowledge workers that acts as a strategic orchestrator for personal and professional development. The application measures and gamifies deep work sessions, helping users translate abstract vision into consistent daily effort.

## Core Principles
1. **Context is King**: Include ALL necessary documentation, examples, and caveats
2. **Validation Loops**: Provide executable tests/lints the AI can run and fix
3. **Information Dense**: Use keywords and patterns from the codebase
4. **Progressive Success**: Start simple, validate, then enhance
5. **Global rules**: Be sure to follow all rules in CLAUDE.md

---

## Goal
Create a production-ready MVP of Chart The Course with all 6 core modules:
- Uncharted Territories (idea capture)
- True North Compass (AI-guided vision creation)
- The Chart Room (strategic initiative mapping)
- The Daily Expedition (focused work sessions)
- Captain's Log (voice-based daily reflection)
- Reading the Wake (analytics and progress visualization)

## Why
- **Business value**: Helps knowledge workers maintain strategic focus and measure deep work
- **Integration**: Combines AI assistance, voice recording, and analytics in a cohesive tool
- **Problems solved**: Bridges gap between high-level vision and daily execution

## What
A Next.js web application with:
- Supabase backend (PostgreSQL, Auth, Edge Functions, Storage)
- AI integration (OpenAI GPT-4o-mini and Whisper)
- Voice recording with transcription
- Real-time analytics and visualizations
- Minimalist, nautical-themed UI

### Success Criteria
- [ ] All 6 modules fully functional
- [ ] Authentication working (email/password + OAuth)
- [ ] Voice recording and transcription operational
- [ ] Database migrations applied successfully
- [ ] All tests passing
- [ ] Deployed to Vercel

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://nextjs.org/docs/app
  why: App Router patterns, API routes, server components
  
- url: https://supabase.com/docs/guides/auth/auth-helpers/nextjs
  why: Authentication setup with Next.js 14
  
- url: https://supabase.com/docs/guides/functions
  why: Edge Functions for serverless backend logic
  
- url: https://supabase.com/docs/guides/storage
  why: File storage for voice recordings
  
- url: https://platform.openai.com/docs/api-reference/audio/createTranscription
  why: Whisper API for voice transcription
  
- url: https://platform.openai.com/docs/api-reference/chat
  why: GPT-4o-mini for AI features

- url: https://tailwindcss.com/docs/utility-first
  why: Styling approach and utilities

- docfile: ai_docs/full-project.md
  why: Complete project specification with all modules

- docfile: ai_docs/architecture.md
  why: Technical architecture and database schema

- docfile: ai_docs/ui-ux.md
  why: Design system and UI patterns

- docfile: ai_docs/voice-recording-guide.md
  why: Comprehensive voice recording implementation patterns

- docfile: ai_docs/industry-best-practices.md
  why: Security and compliance requirements
```

### Current Codebase tree
```bash
.
├── PRPs/
│   ├── EXAMPLE_multi_agent_prp.md
│   └── templates/
│       └── prp_base.md
├── ai_docs/
│   ├── architecture.md
│   ├── full-project.md
│   ├── industry-best-practices.md
│   ├── market-analysis-report.md
│   ├── project-brief.md
│   ├── ui-ux.md
│   └── voice-recording-guide.md
└── CLAUDE.md
```

### Desired Codebase tree with files to be added
```bash
.
├── app/                              # Next.js 14 App Router
│   ├── (auth)/                       # Auth group route
│   │   ├── login/
│   │   │   └── page.tsx             # Login page
│   │   ├── register/
│   │   │   └── page.tsx             # Register page
│   │   └── layout.tsx               # Auth layout
│   ├── (dashboard)/                  # Protected routes
│   │   ├── territories/
│   │   │   └── page.tsx             # Uncharted Territories
│   │   ├── compass/
│   │   │   └── page.tsx             # True North Compass
│   │   ├── chart/
│   │   │   └── page.tsx             # The Chart Room
│   │   ├── expedition/
│   │   │   └── page.tsx             # The Daily Expedition
│   │   ├── log/
│   │   │   └── page.tsx             # Captain's Log
│   │   ├── wake/
│   │   │   └── page.tsx             # Reading the Wake
│   │   └── layout.tsx               # Dashboard layout with nav
│   ├── api/
│   │   ├── auth/
│   │   │   └── callback/
│   │   │       └── route.ts         # Auth callback handler
│   │   ├── ideas/
│   │   │   └── route.ts             # Ideas CRUD
│   │   ├── initiatives/
│   │   │   └── route.ts             # Initiatives CRUD
│   │   ├── work-sessions/
│   │   │   └── route.ts             # Work sessions
│   │   ├── transcribe/
│   │   │   └── route.ts             # Whisper transcription
│   │   └── compress-audio/
│   │       └── route.ts             # Audio compression
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Landing page
│   └── globals.css                   # Global styles
├── components/
│   ├── ui/                           # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Toast.tsx
│   ├── layout/
│   │   ├── Navbar.tsx                # Main navigation
│   │   ├── Sidebar.tsx               # Dashboard sidebar
│   │   └── Footer.tsx                # Footer with quotes
│   ├── modules/
│   │   ├── territories/
│   │   │   ├── IdeaCard.tsx
│   │   │   └── IdeaInput.tsx
│   │   ├── compass/
│   │   │   ├── VisionDocument.tsx
│   │   │   └── ChatInterface.tsx
│   │   ├── chart/
│   │   │   └── ImpactEffortMatrix.tsx
│   │   ├── expedition/
│   │   │   └── FocusTimer.tsx
│   │   ├── log/
│   │   │   ├── VoiceRecorder.tsx
│   │   │   └── LogEntry.tsx
│   │   └── wake/
│   │       ├── ActivityHeatmap.tsx
│   │       └── ProgressCharts.tsx
│   └── shared/
│       ├── AuthProvider.tsx          # Auth context
│       └── LoadingSpinner.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Supabase client setup
│   │   ├── server.ts                 # Server-side client
│   │   └── middleware.ts             # Auth middleware
│   ├── hooks/
│   │   ├── useAudioRecorder.ts      # Voice recording hook
│   │   ├── useWhisperTranscription.ts
│   │   └── useSupabaseQuery.ts      # Data fetching hook
│   ├── utils/
│   │   ├── date.ts                   # Date utilities
│   │   ├── audio.ts                  # Audio processing
│   │   └── validation.ts             # Input validation
│   └── types/
│       ├── database.ts               # Database types
│       └── api.ts                    # API types
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql    # Database schema
│   ├── functions/
│   │   ├── promote-idea/
│   │   │   └── index.ts             # Edge function
│   │   ├── vision-agent/
│   │   │   └── index.ts             # AI vision agent
│   │   └── captain-log-agent/
│   │       └── index.ts             # Log processing
│   └── seed.sql                      # Sample data
├── public/
│   └── images/
│       └── logo.svg
├── tests/
│   ├── unit/
│   │   ├── hooks/
│   │   │   └── useAudioRecorder.test.ts
│   │   └── utils/
│   │       └── validation.test.ts
│   ├── integration/
│   │   ├── auth.test.ts
│   │   └── api.test.ts
│   └── e2e/
│       └── user-journey.test.ts
├── .env.local.example                # Environment template
├── .gitignore
├── next.config.js                    # Next.js config
├── tailwind.config.ts                # Tailwind config
├── tsconfig.json                     # TypeScript config
├── package.json                      # Dependencies
├── README.md                         # Setup instructions
├── middleware.ts                     # Next.js middleware
└── PLANNING.md                       # Architecture decisions
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: Next.js 14 App Router requires 'use client' directive for client components
// CRITICAL: Supabase Row Level Security (RLS) must be enabled on all tables
// CRITICAL: OpenAI Whisper API has 25MB file size limit
// CRITICAL: MediaRecorder API not supported in all browsers - need polyfill
// CRITICAL: Supabase Edge Functions use Deno runtime, not Node.js
// CRITICAL: Environment variables in Next.js need NEXT_PUBLIC_ prefix for client-side
// CRITICAL: Tailwind CSS requires configuration for custom colors
// CRITICAL: React Server Components can't use hooks or browser APIs
// CRITICAL: Use Supabase MCP tools for all database operations and project management
```

## Implementation Blueprint

### Data models and structure

```typescript
// lib/types/database.ts - Database types matching Supabase schema
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          updated_at?: string
        }
      }
      ideas: {
        Row: {
          id: string
          user_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          created_at?: string
        }
        Update: {
          content?: string
        }
      }
      vision: {
        Row: {
          id: string
          user_id: string
          document: Json | null
          chat_history: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          document?: Json | null
          chat_history?: Json | null
        }
        Update: {
          document?: Json | null
          chat_history?: Json | null
          updated_at?: string
        }
      }
      initiatives: {
        Row: {
          id: string
          user_id: string
          name: string
          status: 'backlog' | 'active' | 'completed' | 'archived'
          impact: number
          effort: number
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          status?: 'backlog' | 'active' | 'completed' | 'archived'
          impact: number
          effort: number
        }
        Update: {
          name?: string
          status?: 'backlog' | 'active' | 'completed' | 'archived'
          impact?: number
          effort?: number
          completed_at?: string | null
        }
      }
      work_sessions: {
        Row: {
          id: string
          user_id: string
          initiative_id: string
          duration_minutes: number
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          initiative_id: string
          duration_minutes?: number
          completed_at?: string
        }
      }
      log_entries: {
        Row: {
          id: string
          user_id: string
          log_date: string
          content_structured: Json | null
          original_transcript: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          log_date?: string
          content_structured?: Json | null
          original_transcript?: string | null
        }
      }
    }
  }
}

// lib/types/api.ts - API request/response types
export interface VisionDocument {
  mission: string
  values: string[]
  goals: string[]
  toolStack: string[]
}

export interface LogEntryContent {
  achievements: string[]
  blockers: string[]
  learnings: string[]
  tomorrowFocus: string
}
```

### List of tasks to be completed

```yaml
Task 1: Project Setup and Configuration
CREATE package.json:
  - Next.js 14 with App Router
  - TypeScript, Tailwind CSS
  - Supabase client libraries
  - Testing frameworks
  
CREATE configuration files:
  - next.config.js with environment variables
  - tailwind.config.ts with custom theme
  - tsconfig.json with strict mode
  - .env.local.example with all required vars

Task 2: Database Setup and Migrations
USE Supabase MCP Tools:
  - mcp__supabase__create_project: Create new project (name: chart-the-course-prp)
  - mcp__supabase__apply_migration: Apply schema from architecture.md
  - mcp__supabase__execute_sql: Add RLS policies and indexes
  
SETUP via MCP:
  - Create storage buckets for voice recordings
  - Configure Auth providers through dashboard
  - Enable required extensions (uuid-ossp)

Task 3: Core Utilities and Hooks
CREATE lib/supabase/client.ts:
  - PATTERN: Follow Supabase Next.js guide
  - Separate client for server/client components
  - Add auth helpers
  
CREATE lib/hooks/useAudioRecorder.ts:
  - PATTERN: Copy from voice-recording-guide.md
  - Add browser compatibility checks
  - Handle permissions properly

Task 4: Authentication Flow
CREATE app/(auth)/login/page.tsx:
  - Email/password login form
  - OAuth buttons (Google, GitHub)
  - Link to registration
  
CREATE middleware.ts:
  - Protect dashboard routes
  - Redirect logic
  
Task 5: Module 1 - Uncharted Territories
CREATE app/(dashboard)/territories/page.tsx:
  - Idea input with instant capture
  - List of ideas with triage actions
  - Promote to initiative flow
  
CREATE components/modules/territories/:
  - IdeaCard with hover actions
  - IdeaInput with Enter key handling

Task 6: Module 2 - True North Compass
CREATE app/(dashboard)/compass/page.tsx:
  - Two-panel layout (vision + chat)
  - AI chat interface
  - Vision document display
  
DEPLOY Edge Function via MCP:
  - mcp__supabase__deploy_edge_function: Deploy vision-agent
  - Include OpenAI integration code
  - Chat history management
  - Vision document parsing

Task 7: Module 3 - The Chart Room
CREATE app/(dashboard)/chart/page.tsx:
  - 2x2 Impact/Effort matrix
  - Initiative cards positioning
  - Status management
  
CREATE components/modules/chart/ImpactEffortMatrix.tsx:
  - CSS Grid for quadrants
  - Card positioning logic

Task 8: Module 4 - The Daily Expedition
CREATE app/(dashboard)/expedition/page.tsx:
  - Minimalist timer interface
  - Initiative selection
  - Focus mode design
  
CREATE components/modules/expedition/FocusTimer.tsx:
  - 90-minute countdown
  - Fullscreen focus mode
  - Session completion

Task 9: Module 5 - Captain's Log
CREATE app/(dashboard)/log/page.tsx:
  - Voice recording interface
  - Daily log timeline
  - Work session summary
  
DEPLOY Edge Function via MCP:
  - mcp__supabase__deploy_edge_function: Deploy captain-log-agent
  - Whisper transcription integration
  - GPT structuring logic
  - Database storage operations

Task 10: Module 6 - Reading the Wake
CREATE app/(dashboard)/wake/page.tsx:
  - Activity heatmap
  - Streak tracking
  - Effort allocation charts
  
CREATE components/modules/wake/:
  - D3.js or Recharts visualizations
  - Performance optimizations

Task 11: API Routes and Edge Functions
CREATE app/api/* routes:
  - CRUD operations for all entities
  - File upload for audio
  - Transcription endpoint
  
DEPLOY Edge Functions via MCP:
  - mcp__supabase__deploy_edge_function: Deploy promote-idea function
  - Include transaction logic for idea->initiative
  - Add error handling and rate limiting
  - Test with mcp__supabase__get_logs for debugging

Task 12: Testing and Documentation
CREATE tests/:
  - Unit tests for hooks
  - Integration tests for API
  - E2E test for user journey
  
UPDATE README.md:
  - Setup instructions
  - Environment variables
  - Deployment guide
```

### Per task pseudocode

```typescript
// Task 3: useAudioRecorder hook
async function useAudioRecorder() {
  // PATTERN: Follow voice-recording-guide.md exactly
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder>()
  
  const startRecording = async () => {
    // GOTCHA: Check browser support first
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      throw new Error('MediaRecorder not supported')
    }
    
    // Request permission with proper constraints
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100,
      }
    })
    
    // CRITICAL: Use supported MIME type
    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
      ? 'audio/webm;codecs=opus' 
      : 'audio/webm'
    
    const recorder = new MediaRecorder(stream, { mimeType })
    // ... rest of implementation from guide
  }
}

// Task 6: Vision Agent Edge Function
Deno.serve(async (req) => {
  // PATTERN: Supabase Edge Function pattern
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  // CRITICAL: Verify JWT token
  const authHeader = req.headers.get('Authorization')
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  )
  
  // Get user from JWT
  const { data: { user } } = await supabaseClient.auth.getUser()
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  // PATTERN: OpenAI streaming response
  const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY') })
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [...chatHistory, { role: 'user', content: newMessage }],
    stream: true,
  })
  
  // Return SSE stream
  return new Response(stream, {
    headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' }
  })
})

// Task 9: Voice transcription API
export async function POST(request: NextRequest) {
  // PATTERN: Follow voice-recording-guide.md Whisper section
  const formData = await request.formData()
  const audioFile = formData.get('audio') as File
  
  // CRITICAL: Whisper has 25MB limit
  if (audioFile.size > 25 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large' }, { status: 400 })
  }
  
  // Convert to supported format if needed
  const audioBuffer = await audioFile.arrayBuffer()
  
  // GOTCHA: OpenAI expects multipart/form-data
  const openAIFormData = new FormData()
  openAIFormData.append('file', new Blob([audioBuffer]), 'audio.webm')
  openAIFormData.append('model', 'whisper-1')
  
  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: openAIFormData,
  })
  
  // Return transcription
  const result = await response.json()
  return NextResponse.json({ text: result.text })
}
```

### Integration Points
```yaml
DATABASE (via Supabase MCP):
  - mcp__supabase__apply_migration: Run schema migrations
  - mcp__supabase__execute_sql: Enable RLS policies
  - mcp__supabase__execute_sql: Create indexes on foreign keys
  - mcp__supabase__get_advisors: Check security recommendations
  
AUTHENTICATION:
  - Configure via Supabase Dashboard (OAuth providers)
  - Set callback URLs in provider settings
  - middleware: Protect /dashboard/* routes in Next.js
  
STORAGE (via Supabase MCP):
  - mcp__supabase__execute_sql: Create storage policies
  - Configure CORS in Supabase Dashboard
  - Set max file size limits (25MB for audio)
  
ENVIRONMENT:
  - mcp__supabase__get_project_url: Get project URL
  - mcp__supabase__get_anon_key: Get anon key
  - add to: .env.local
  - vars: |
      # Supabase (get via MCP tools)
      NEXT_PUBLIC_SUPABASE_URL=[from mcp__supabase__get_project_url]
      NEXT_PUBLIC_SUPABASE_ANON_KEY=[from mcp__supabase__get_anon_key]
      SUPABASE_SERVICE_ROLE_KEY=[from dashboard]
      
      # OpenAI
      OPENAI_API_KEY=sk-...
      
      # App
      NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Run these FIRST - fix any errors before proceeding
npm run lint                    # ESLint with Next.js config
npm run type-check              # TypeScript compilation
npm run format                  # Prettier formatting

# Expected: No errors. If errors, READ and fix.
```

### Level 2: Unit Tests
```typescript
// tests/unit/hooks/useAudioRecorder.test.ts
import { renderHook, act } from '@testing-library/react-hooks'
import { useAudioRecorder } from '@/lib/hooks/useAudioRecorder'

describe('useAudioRecorder', () => {
  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useAudioRecorder())
    expect(result.current.isRecording).toBe(false)
    expect(result.current.audioBlob).toBeNull()
  })
  
  it('should handle permission denied gracefully', async () => {
    // Mock getUserMedia to reject
    global.navigator.mediaDevices = {
      getUserMedia: jest.fn().mockRejectedValue(new Error('Permission denied'))
    }
    
    const { result } = renderHook(() => useAudioRecorder())
    await act(async () => {
      await expect(result.current.startRecording()).rejects.toThrow('Permission denied')
    })
  })
})
```

```bash
# Run tests iteratively until passing:
npm test -- --coverage

# If failing: Debug specific test, fix code, re-run
```

### Level 3: Integration Test
```bash
# Start development server
npm run dev

# Check Supabase project status via MCP
# Use mcp__supabase__get_project to verify project is active

# Test auth flow
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "testpass123"}'

# Expected: {"user": {...}, "session": {...}}

# Check logs if errors via MCP
# Use mcp__supabase__get_logs with service='api' or 'auth'
```

### Level 4: E2E Test
```typescript
// tests/e2e/user-journey.test.ts
import { test, expect } from '@playwright/test'

test('complete user journey', async ({ page }) => {
  // 1. Register new user
  await page.goto('/register')
  await page.fill('[name="email"]', 'test@example.com')
  await page.fill('[name="password"]', 'testpass123')
  await page.click('button[type="submit"]')
  
  // 2. Create idea in Uncharted Territories
  await page.goto('/territories')
  await page.fill('[placeholder="Capture your idea..."]', 'Build AI assistant')
  await page.press('[placeholder="Capture your idea..."]', 'Enter')
  
  // 3. Promote to initiative
  await page.hover('text=Build AI assistant')
  await page.click('button:has-text("Promote")')
  await page.click('[aria-label="Impact: 4"]')
  await page.click('[aria-label="Effort: 3"]')
  
  // 4. Verify in Chart Room
  await page.goto('/chart')
  await expect(page.locator('text=Build AI assistant')).toBeVisible()
})
```

## Final Validation Checklist
- [ ] All tests pass: `npm test`
- [ ] No linting errors: `npm run lint`
- [ ] No type errors: `npm run type-check`
- [ ] Database migrations applied via MCP: `mcp__supabase__list_migrations`
- [ ] Auth flow works (login, register, OAuth)
- [ ] Voice recording works across browsers
- [ ] All 6 modules functional
- [ ] Edge functions deployed: `mcp__supabase__list_edge_functions`
- [ ] Responsive design on mobile
- [ ] Deployment to Vercel successful
- [ ] Environment variables configured (retrieved via MCP)
- [ ] RLS policies enforced (check via `mcp__supabase__get_advisors`)
- [ ] Error handling graceful
- [ ] Loading states smooth
- [ ] README comprehensive

---

## Anti-Patterns to Avoid
- ❌ Don't use client components for data fetching - use Server Components
- ❌ Don't expose sensitive keys in NEXT_PUBLIC_ variables
- ❌ Don't skip RLS policies on Supabase tables
- ❌ Don't ignore browser compatibility for MediaRecorder
- ❌ Don't exceed Whisper API file size limits
- ❌ Don't use synchronous operations in Edge Functions
- ❌ Don't hardcode environment-specific values
- ❌ Don't skip error boundaries for async operations

## Confidence Score: 9/10

High confidence due to:
- Comprehensive documentation and guides provided
- Clear architectural patterns from Supabase and Next.js
- Detailed voice recording implementation guide
- Well-defined database schema and UI/UX requirements

Minor uncertainty on:
- Exact OAuth provider setup steps (but well-documented)
- Potential browser-specific audio recording issues
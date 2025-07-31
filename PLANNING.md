# Chart The Course - Planning Document

## Project Overview
Chart The Course is a minimalist SaaS web application for knowledge workers, designed as a strategic orchestrator for personal and professional development. It measures and gamifies deep work sessions, helping users translate abstract vision into consistent daily effort.

## Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router)
- **UI Framework**: React 18+
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (via Supabase)
- **Backend**: Supabase (Auth, Edge Functions, Storage)
- **AI Services**: OpenAI (GPT-4o-mini, Whisper)
- **Deployment**: Vercel (Frontend), Supabase (Backend)

### Core Modules
1. **Uncharted Territories** - Idea capture and triage
2. **True North Compass** - AI-guided vision creation
3. **The Chart Room** - Strategic initiative mapping (Impact/Effort matrix)
4. **The Daily Expedition** - Focused 90-minute work sessions
5. **Captain's Log** - Voice-based daily reflection
6. **Reading the Wake** - Analytics and progress visualization

### Design Principles
- **Minimalism & Focus**: Clean, uncluttered interface with ample negative space
- **Nautical Theme**: Subtle through color palette and language, not literal graphics
- **High-Signal, Low-Noise**: Clear, purposeful information presentation
- **Frictionless Input**: Voice and keyboard shortcuts as first-class citizens
- **Satisfying Feedback**: Subtle micro-interactions for key actions

### Color Palette
- Background: Off-white (#F8F5F0)
- Primary Text: Dark blue (#2E4057)
- Accent: Muted gold/brass (#C5A06D)
- Secondary Text: Soft grey (#8A94A2)

### Typography
- Headings: Serif (Lora or Playfair Display)
- Body: Sans-serif (Inter)

## Project Structure
```
.
├── app/                              # Next.js 14 App Router
│   ├── (auth)/                       # Auth group route
│   ├── (dashboard)/                  # Protected routes
│   ├── api/                          # API routes
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Landing page
│   └── globals.css                   # Global styles
├── components/                       # Reusable components
│   ├── ui/                          # UI components
│   ├── layout/                      # Layout components
│   ├── modules/                     # Module-specific components
│   └── shared/                      # Shared components
├── lib/                             # Utilities and types
│   ├── supabase/                    # Supabase clients
│   ├── hooks/                       # Custom hooks
│   ├── utils/                       # Utility functions
│   └── types/                       # TypeScript types
├── supabase/                        # Database and functions
│   ├── migrations/                  # SQL migrations
│   ├── functions/                   # Edge functions
│   └── seed.sql                     # Sample data
├── tests/                           # Test files
├── public/                          # Static assets
└── config files...                  # Various configuration
```

## Coding Standards

### TypeScript
- Strict mode enabled
- Type all function parameters and returns
- Use interfaces for object shapes
- Prefer `type` for unions and aliases

### React/Next.js
- Use Server Components by default
- Client Components only when needed (interactivity)
- Implement proper loading and error states
- Use Next.js built-in optimization features

### Styling
- Tailwind CSS for all styling
- No inline styles except for dynamic values
- Component-specific styles in CSS modules when needed
- Follow mobile-first responsive design

### State Management
- Server state via Supabase queries
- Client state via React hooks
- No global state management library initially

### Testing
- Unit tests for utilities and hooks
- Integration tests for API routes
- E2E tests for critical user journeys

### Git Conventions
- Feature branches: `feature/module-name`
- Commit messages: `type(scope): description`
- Types: feat, fix, docs, style, refactor, test, chore

## Security Considerations
- Row Level Security (RLS) on all tables
- Environment variables for sensitive data
- Input validation on all forms
- Rate limiting on API routes
- Secure session management via Supabase Auth

## Performance Targets
- First Contentful Paint: < 1s
- Time to Interactive: < 2s
- Lighthouse Score: > 90
- Bundle size: < 300KB initial load

## Deployment Strategy
- Continuous deployment via Vercel
- Preview deployments for PRs
- Production deployments on main branch
- Environment-specific configurations

## Future Considerations
- Mobile app (React Native)
- Team features ("The Crew")
- API integrations ("Signal Flares")
- AI coaching ("The First Mate")
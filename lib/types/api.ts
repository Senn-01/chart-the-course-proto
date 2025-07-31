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

export interface ApiResponse<T = any> {
  data?: T
  error?: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
  } | null
  session: {
    access_token: string
    refresh_token: string
  } | null
}

export interface WorkSessionCreate {
  initiative_id: string
  duration_minutes?: number
}

export interface IdeaCreate {
  content: string
}

export interface InitiativeCreate {
  name: string
  impact: number
  effort: number
  status?: 'backlog' | 'active' | 'completed' | 'archived'
}

export interface PromoteIdeaRequest {
  ideaId: string
  impact: number
  effort: number
}
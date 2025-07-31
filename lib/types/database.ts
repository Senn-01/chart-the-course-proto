export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          updated_at?: string
        }
      }
      ideas: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          tags: string[] | null
          status: 'captured' | 'explored' | 'archived'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          title: string
          description?: string | null
          tags?: string[] | null
          status?: 'captured' | 'explored' | 'archived'
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          tags?: string[] | null
          status?: 'captured' | 'explored' | 'archived'
          updated_at?: string
        }
      }
      vision_documents: {
        Row: {
          id: string
          user_id: string
          content: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          content: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          content?: Json
          updated_at?: string
        }
      }
      vision_chats: {
        Row: {
          id: string
          user_id: string
          message: string
          role: 'user' | 'assistant'
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          message: string
          role: 'user' | 'assistant'
          created_at?: string
        }
        Update: {
          message?: string
          role?: 'user' | 'assistant'
        }
      }
      initiatives: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          status: 'backlog' | 'active' | 'completed' | 'archived'
          impact: number
          effort: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          name: string
          description?: string | null
          status?: 'backlog' | 'active' | 'completed' | 'archived'
          impact: number
          effort: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          status?: 'backlog' | 'active' | 'completed' | 'archived'
          impact?: number
          effort?: number
          updated_at?: string
        }
      }
      work_sessions: {
        Row: {
          id: string
          user_id: string
          initiative_id: string | null
          started_at: string
          ended_at: string | null
          duration_minutes: number
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          initiative_id?: string | null
          started_at?: string
          ended_at?: string | null
          duration_minutes?: number
          completed?: boolean
          created_at?: string
        }
        Update: {
          initiative_id?: string | null
          ended_at?: string | null
          duration_minutes?: number
          completed?: boolean
        }
      }
      log_entries: {
        Row: {
          id: string
          user_id: string
          content: Json | null
          transcription: string | null
          audio_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          content?: Json | null
          transcription?: string | null
          audio_url?: string | null
          created_at?: string
        }
        Update: {
          content?: Json | null
          transcription?: string | null
          audio_url?: string | null
        }
      }
    }
  }
}
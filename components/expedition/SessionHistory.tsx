'use client'

import { formatTime } from '@/lib/utils/helpers'
import type { Database } from '@/lib/types/database'

type WorkSession = Database['public']['Tables']['work_sessions']['Row']
type Initiative = Database['public']['Tables']['initiatives']['Row']

interface SessionHistoryProps {
  sessions: WorkSession[]
  initiatives: Initiative[]
}

export function SessionHistory({ sessions, initiatives }: SessionHistoryProps) {
  const getInitiativeName = (id: string | null) => {
    if (!id) return 'General Focus'
    const initiative = initiatives.find(i => i.id === id)
    return initiative?.name || 'Unknown'
  }

  const getSessionDuration = (session: WorkSession) => {
    if (!session.ended_at) return 'In Progress'
    const start = new Date(session.started_at)
    const end = new Date(session.ended_at)
    const seconds = Math.floor((end.getTime() - start.getTime()) / 1000)
    return formatTime(seconds)
  }

  const getSessionTime = (session: WorkSession) => {
    const date = new Date(session.started_at)
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  if (sessions.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-muted">No expeditions logged today. Time to embark!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <div 
          key={session.id} 
          className={`card flex items-center justify-between ${
            !session.ended_at ? 'ring-2 ring-accent' : ''
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="text-2xl">
              {!session.ended_at ? '⚓' : session.completed ? '✅' : '⏸️'}
            </div>
            <div>
              <h4 className="font-medium text-sm">
                {getInitiativeName(session.initiative_id)}
              </h4>
              <p className="text-xs text-muted">
                Started at {getSessionTime(session)}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="font-mono font-medium text-sm">
              {getSessionDuration(session)}
            </p>
            {session.ended_at && (
              <p className="text-xs text-muted">
                {session.completed ? 'Completed' : 'Paused'}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
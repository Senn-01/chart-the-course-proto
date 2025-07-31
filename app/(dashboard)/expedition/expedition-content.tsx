'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FocusTimer } from '@/components/expedition/FocusTimer'
import { SessionHistory } from '@/components/expedition/SessionHistory'
import { DailyProgress } from '@/components/expedition/DailyProgress'
import type { Database } from '@/lib/types/database'

type WorkSession = Database['public']['Tables']['work_sessions']['Row']
type Initiative = Database['public']['Tables']['initiatives']['Row']

interface ExpeditionContentProps {
  initialSessions: WorkSession[]
  initiatives: Initiative[]
}

export function ExpeditionContent({ initialSessions, initiatives }: ExpeditionContentProps) {
  const [sessions, setSessions] = useState<WorkSession[]>(initialSessions)
  const [activeSession, setActiveSession] = useState<WorkSession | null>(null)
  const [selectedInitiative, setSelectedInitiative] = useState<string | null>(null)
  const supabase = createClient()

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('sessions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'work_sessions',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setSessions((current) => [payload.new as WorkSession, ...current])
            if (!payload.new.ended_at) {
              setActiveSession(payload.new as WorkSession)
            }
          } else if (payload.eventType === 'UPDATE') {
            setSessions((current) =>
              current.map((session) =>
                session.id === payload.new.id ? (payload.new as WorkSession) : session
              )
            )
            if (payload.new.id === activeSession?.id) {
              if (payload.new.ended_at) {
                setActiveSession(null)
              } else {
                setActiveSession(payload.new as WorkSession)
              }
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, activeSession, sessions])

  // Check for active session on mount
  useEffect(() => {
    const active = sessions.find(s => !s.ended_at)
    if (active) {
      setActiveSession(active)
      setSelectedInitiative(active.initiative_id || null)
    }
  }, [])

  const handleSessionStart = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.error('User not authenticated')
      return
    }

    const { data, error } = await supabase
      .from('work_sessions')
      .insert({
        user_id: user.id,
        initiative_id: selectedInitiative,
        duration_minutes: 90,
        started_at: new Date().toISOString(),
        completed: false,
      })
      .select()
      .single()

    if (error) {
      console.error('Error starting session:', error)
    } else if (data) {
      // Immediately update the UI
      setSessions((current) => [data, ...current])
      setActiveSession(data)
    }
  }

  const handleSessionEnd = async () => {
    if (!activeSession) return

    // Optimistically update the UI
    const updatedSession = {
      ...activeSession,
      ended_at: new Date().toISOString(),
      completed: true,
    }
    
    setSessions((current) =>
      current.map((session) =>
        session.id === activeSession.id ? updatedSession : session
      )
    )
    setActiveSession(null)

    const { error } = await supabase
      .from('work_sessions')
      .update({
        ended_at: new Date().toISOString(),
        completed: true,
      })
      .eq('id', activeSession.id)

    if (error) {
      console.error('Error ending session:', error)
      // Revert on error
      setSessions((current) =>
        current.map((session) =>
          session.id === activeSession.id ? activeSession : session
        )
      )
      setActiveSession(activeSession)
    }
  }

  const handleSessionPause = async () => {
    if (!activeSession) return

    const { error } = await supabase
      .from('work_sessions')
      .update({
        ended_at: new Date().toISOString(),
        completed: false,
      })
      .eq('id', activeSession.id)

    if (error) {
      console.error('Error pausing session:', error)
    }
  }

  // Calculate daily stats
  const todaysSessions = sessions.filter(s => {
    const sessionDate = new Date(s.started_at)
    const today = new Date()
    return sessionDate.toDateString() === today.toDateString()
  })

  const completedToday = todaysSessions.filter(s => s.completed).length
  const totalMinutesToday = todaysSessions
    .filter(s => s.ended_at)
    .reduce((total, session) => {
      const start = new Date(session.started_at)
      const end = new Date(session.ended_at!)
      return total + Math.floor((end.getTime() - start.getTime()) / 1000 / 60)
    }, 0)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="heading-1 mb-2">The Daily Expedition</h1>
        <p className="text-muted text-lg">
          Navigate 90-minute voyages of deep, focused work
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Timer Section */}
        <div className="lg:col-span-2">
          <FocusTimer
            activeSession={activeSession}
            selectedInitiative={selectedInitiative}
            initiatives={initiatives}
            onInitiativeSelect={setSelectedInitiative}
            onStart={handleSessionStart}
            onEnd={handleSessionEnd}
            onPause={handleSessionPause}
          />
        </div>

        {/* Stats Section */}
        <div className="space-y-6">
          <DailyProgress
            completedSessions={completedToday}
            totalMinutes={totalMinutesToday}
            targetSessions={3}
          />
        </div>
      </div>

      {/* History Section */}
      <div className="mt-8">
        <h2 className="heading-3 mb-4">Today&apos;s Voyages</h2>
        <SessionHistory sessions={todaysSessions} initiatives={initiatives} />
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { VoiceRecorder } from '@/components/log/VoiceRecorder'
import { LogEntry } from '@/components/log/LogEntry'
import { LogHistory } from '@/components/log/LogHistory'
import type { Database } from '@/lib/types/database'

type LogEntryType = Database['public']['Tables']['log_entries']['Row']

interface LogContentProps {
  initialEntries: LogEntryType[]
  todaysEntry?: LogEntryType
}

export function LogContent({ initialEntries, todaysEntry }: LogContentProps) {
  const [entries, setEntries] = useState<LogEntryType[]>(initialEntries)
  const [isRecording, setIsRecording] = useState(false)
  const [currentEntry, setCurrentEntry] = useState<LogEntryType | null>(todaysEntry || null)
  const [showHistory, setShowHistory] = useState(false)
  const supabase = createClient()

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('log-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'log_entries',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setEntries((current) => [payload.new as LogEntryType, ...current])
            
            // Check if it's today's entry
            const entryDate = new Date(payload.new.created_at)
            const today = new Date()
            if (entryDate.toDateString() === today.toDateString()) {
              setCurrentEntry(payload.new as LogEntryType)
            }
          } else if (payload.eventType === 'UPDATE') {
            setEntries((current) =>
              current.map((entry) =>
                entry.id === payload.new.id ? (payload.new as LogEntryType) : entry
              )
            )
            if (currentEntry?.id === payload.new.id) {
              setCurrentEntry(payload.new as LogEntryType)
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, currentEntry])

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setIsRecording(false)
    
    // Upload audio to storage
    const fileName = `${Date.now()}.webm`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('voice-logs')
      .upload(fileName, audioBlob)

    if (uploadError) {
      console.error('Error uploading audio:', uploadError)
      return
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('voice-logs')
      .getPublicUrl(fileName)

    // Call edge function for transcription
    const { data, error } = await supabase.functions.invoke('transcribe-log', {
      body: { audioUrl: publicUrl },
    })

    if (error) {
      console.error('Error transcribing:', error)
      return
    }

    // The transcription result will be saved via the edge function
  }

  const handleManualEntry = async (content: any) => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.error('User not authenticated')
      return
    }

    const { data, error } = await supabase
      .from('log_entries')
      .insert({
        user_id: user.id,
        content,
        transcription: null,
        audio_url: null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating log entry:', error)
    } else if (data) {
      // Immediately update the UI
      setEntries((current) => [data, ...current])
      setCurrentEntry(data)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="heading-1 mb-2">Captain&apos;s Log</h1>
        <p className="text-muted text-lg">
          Reflect on your voyage with voice-powered daily entries
        </p>
      </div>

      {/* Recording Section */}
      <div className="mb-8">
        {!currentEntry ? (
          <VoiceRecorder
            isRecording={isRecording}
            onRecordingStart={() => setIsRecording(true)}
            onRecordingComplete={handleRecordingComplete}
            onRecordingCancel={() => setIsRecording(false)}
          />
        ) : (
          <div className="card bg-green-50 border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">✅</span>
              <h3 className="heading-4">Today&apos;s Entry Complete</h3>
            </div>
            <p className="text-sm text-muted mb-4">
              Great job capturing your daily reflection! Come back tomorrow for your next entry.
            </p>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="btn-ghost text-sm"
            >
              {showHistory ? 'Hide' : 'View'} Past Entries
            </button>
          </div>
        )}
      </div>

      {/* Current Entry Display */}
      {currentEntry && !showHistory && (
        <div className="mb-8">
          <h2 className="heading-3 mb-4">Today&apos;s Reflection</h2>
          <LogEntry entry={currentEntry} isExpanded />
        </div>
      )}

      {/* History Section */}
      {showHistory && (
        <div>
          <h2 className="heading-3 mb-4">Past Entries</h2>
          <LogHistory entries={entries} />
        </div>
      )}

      {/* Manual Entry Option */}
      {!currentEntry && !isRecording && (
        <div className="text-center">
          <p className="text-sm text-muted mb-4">
            Prefer to type? You can also{' '}
            <button
              onClick={() => {
                // In a real app, this would open a form
                const mockContent = {
                  achievements: ['Completed focus sessions', 'Made progress on key initiative'],
                  blockers: ['Struggled with API integration'],
                  learnings: ['Discovered new debugging technique'],
                  tomorrowFocus: 'Finish the integration and start testing',
                }
                handleManualEntry(mockContent)
              }}
              className="text-accent hover:text-accent-dark font-medium"
            >
              create a written entry
            </button>
          </p>
        </div>
      )}
    </div>
  )
}
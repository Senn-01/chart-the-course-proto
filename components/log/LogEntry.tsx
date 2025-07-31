'use client'

import { useState } from 'react'
import { formatDate } from '@/lib/utils/helpers'
import type { Database } from '@/lib/types/database'

type LogEntryType = Database['public']['Tables']['log_entries']['Row']

interface LogEntryProps {
  entry: LogEntryType
  isExpanded?: boolean
}

export function LogEntry({ entry, isExpanded = false }: LogEntryProps) {
  const [showTranscription, setShowTranscription] = useState(false)
  
  const content = entry.content as {
    achievements?: string[]
    blockers?: string[]
    learnings?: string[]
    tomorrowFocus?: string
  }

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-medium text-primary">
            {formatDate(new Date(entry.created_at))}
          </h4>
          {entry.audio_url && (
            <span className="text-xs text-muted">🎙️ Voice entry</span>
          )}
        </div>
        {entry.audio_url && (
          <audio controls className="w-48">
            <source src={entry.audio_url} type="audio/webm" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>

      <div className="space-y-4">
        {content.achievements && content.achievements.length > 0 && (
          <div>
            <h5 className="font-medium text-sm text-primary mb-1 flex items-center gap-1">
              <span>🎯</span> Achievements
            </h5>
            <ul className="space-y-1">
              {content.achievements.map((achievement, index) => (
                <li key={index} className="text-sm text-muted flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {content.blockers && content.blockers.length > 0 && (
          <div>
            <h5 className="font-medium text-sm text-primary mb-1 flex items-center gap-1">
              <span>🚧</span> Blockers
            </h5>
            <ul className="space-y-1">
              {content.blockers.map((blocker, index) => (
                <li key={index} className="text-sm text-muted flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>{blocker}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {content.learnings && content.learnings.length > 0 && (
          <div>
            <h5 className="font-medium text-sm text-primary mb-1 flex items-center gap-1">
              <span>💡</span> Learnings
            </h5>
            <ul className="space-y-1">
              {content.learnings.map((learning, index) => (
                <li key={index} className="text-sm text-muted flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>{learning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {content.tomorrowFocus && (
          <div>
            <h5 className="font-medium text-sm text-primary mb-1 flex items-center gap-1">
              <span>🎯</span> Tomorrow&apos;s Focus
            </h5>
            <p className="text-sm text-muted">{content.tomorrowFocus}</p>
          </div>
        )}
      </div>

      {entry.transcription && (
        <div className="mt-4 pt-4 border-t border-muted/20">
          <button
            onClick={() => setShowTranscription(!showTranscription)}
            className="text-sm text-accent hover:text-accent-dark font-medium"
          >
            {showTranscription ? 'Hide' : 'Show'} Full Transcription
          </button>
          {showTranscription && (
            <p className="mt-2 text-sm text-muted italic whitespace-pre-wrap">
              {entry.transcription}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
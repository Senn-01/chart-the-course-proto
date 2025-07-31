'use client'

import { useState, useEffect, useRef } from 'react'
import { formatTime } from '@/lib/utils/helpers'
import type { Database } from '@/lib/types/database'

type WorkSession = Database['public']['Tables']['work_sessions']['Row']
type Initiative = Database['public']['Tables']['initiatives']['Row']

interface FocusTimerProps {
  activeSession: WorkSession | null
  selectedInitiative: string | null
  initiatives: Initiative[]
  onInitiativeSelect: (id: string | null) => void
  onStart: () => void
  onEnd: () => void
  onPause: () => void
}

export function FocusTimer({
  activeSession,
  selectedInitiative,
  initiatives,
  onInitiativeSelect,
  onStart,
  onEnd,
  onPause,
}: FocusTimerProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (activeSession && !activeSession.ended_at) {
      // Calculate elapsed time
      const startTime = new Date(activeSession.started_at).getTime()
      const updateElapsed = () => {
        const now = Date.now()
        setElapsedSeconds(Math.floor((now - startTime) / 1000))
      }

      updateElapsed()
      intervalRef.current = setInterval(updateElapsed, 1000)

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    } else {
      setElapsedSeconds(0)
    }
  }, [activeSession])

  const targetSeconds = 90 * 60 // 90 minutes
  const progress = Math.min((elapsedSeconds / targetSeconds) * 100, 100)
  const remaining = Math.max(targetSeconds - elapsedSeconds, 0)
  const isOvertime = elapsedSeconds > targetSeconds

  return (
    <div className="card">
      <div className="text-center mb-8">
        {/* Timer Display */}
        <div className="mb-6">
          <div className="text-6xl font-mono font-bold text-primary mb-2">
            {formatTime(activeSession ? elapsedSeconds : targetSeconds)}
          </div>
          {activeSession && (
            <p className="text-sm text-muted">
              {isOvertime ? 'Extended voyage' : `${formatTime(remaining)} remaining`}
            </p>
          )}
        </div>

        {/* Progress Ring */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 88}`}
              strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
              className={`transition-all duration-1000 ${
                isOvertime ? 'text-yellow-500' : 'text-accent'
              }`}
            />
          </svg>
          <div className="absolute text-4xl">
            {activeSession ? '⚓' : '🧭'}
          </div>
        </div>

        {/* Initiative Selection */}
        {!activeSession && (
          <div className="mb-6">
            <label htmlFor="initiative" className="block text-sm font-medium text-primary mb-2">
              Choose Your Voyage
            </label>
            <select
              id="initiative"
              value={selectedInitiative || ''}
              onChange={(e) => onInitiativeSelect(e.target.value || null)}
              className="input"
            >
              <option value="">General Focus</option>
              {initiatives.map((initiative) => (
                <option key={initiative.id} value={initiative.id}>
                  {initiative.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          {!activeSession ? (
            <button
              onClick={onStart}
              className="btn-primary px-8 py-3 text-lg"
            >
              ⚓ Begin Expedition
            </button>
          ) : (
            <>
              <button
                onClick={onEnd}
                className="btn-primary px-6 py-2"
              >
                🏁 Complete
              </button>
              <button
                onClick={onPause}
                className="btn-ghost px-6 py-2"
              >
                ⏸️ Pause
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="border-t border-muted/20 pt-4">
        <h3 className="font-medium text-sm text-primary mb-2">Navigation Tips</h3>
        <ul className="space-y-1 text-sm text-muted">
          <li>• Remove all distractions before starting</li>
          <li>• Focus on a single initiative or task</li>
          <li>• Take a 15-minute break after each session</li>
          <li>• Aim for 3 expeditions per day</li>
        </ul>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { ProgressChart } from '@/components/wake/ProgressChart'
import { StatsOverview } from '@/components/wake/StatsOverview'
import { InitiativeProgress } from '@/components/wake/InitiativeProgress'
import { PatternInsights } from '@/components/wake/PatternInsights'
import type { Database } from '@/lib/types/database'

type WorkSession = Database['public']['Tables']['work_sessions']['Row']
type Initiative = Database['public']['Tables']['initiatives']['Row'] & {
  work_sessions?: { count: number }[]
}

interface Analytics {
  totalSessions: number
  totalHours: number
  completedInitiatives: number
  activeInitiatives: number
  ideasByStatus: {
    captured: number
    explored: number
    archived: number
  }
}

interface WakeContentProps {
  sessions: WorkSession[]
  initiatives: Initiative[]
  analytics: Analytics
}

export function WakeContent({ sessions, initiatives, analytics }: WakeContentProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month')

  // Filter sessions based on time range
  const filteredSessions = sessions.filter(session => {
    const sessionDate = new Date(session.started_at)
    const now = new Date()
    
    if (timeRange === 'week') {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return sessionDate >= weekAgo
    } else if (timeRange === 'month') {
      const monthAgo = new Date()
      monthAgo.setDate(monthAgo.getDate() - 30)
      return sessionDate >= monthAgo
    }
    return true
  })

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="heading-1 mb-2">Reading the Wake</h1>
        <p className="text-muted text-lg">
          Track your voyage and discover patterns in your progress
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setTimeRange('week')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            timeRange === 'week'
              ? 'bg-accent text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Past Week
        </button>
        <button
          onClick={() => setTimeRange('month')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            timeRange === 'month'
              ? 'bg-accent text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Past Month
        </button>
        <button
          onClick={() => setTimeRange('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            timeRange === 'all'
              ? 'bg-accent text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Time
        </button>
      </div>

      {/* Stats Overview */}
      <StatsOverview analytics={analytics} />

      {/* Progress Chart */}
      <div className="mb-8">
        <h2 className="heading-3 mb-4">Focus Session Trends</h2>
        <ProgressChart sessions={filteredSessions} timeRange={timeRange} />
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Initiative Progress */}
        <div>
          <h2 className="heading-3 mb-4">Initiative Progress</h2>
          <InitiativeProgress initiatives={initiatives} />
        </div>

        {/* Pattern Insights */}
        <div>
          <h2 className="heading-3 mb-4">Navigation Patterns</h2>
          <PatternInsights sessions={sessions} />
        </div>
      </div>
    </div>
  )
}
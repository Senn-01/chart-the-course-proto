'use client'

import { useMemo } from 'react'
import type { Database } from '@/lib/types/database'

type WorkSession = Database['public']['Tables']['work_sessions']['Row']

interface ProgressChartProps {
  sessions: WorkSession[]
  timeRange: 'week' | 'month' | 'all'
}

export function ProgressChart({ sessions, timeRange }: ProgressChartProps) {
  const chartData = useMemo(() => {
    // Group sessions by day
    const sessionsByDay = sessions.reduce((acc, session) => {
      const date = new Date(session.started_at).toLocaleDateString()
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(session)
      return acc
    }, {} as Record<string, WorkSession[]>)

    // Calculate daily stats
    const dailyStats = Object.entries(sessionsByDay).map(([date, daySessions]) => {
      const completedSessions = daySessions.filter(s => s.completed).length
      const totalMinutes = daySessions.reduce((total, session) => {
        if (session.ended_at) {
          const duration = new Date(session.ended_at).getTime() - new Date(session.started_at).getTime()
          return total + Math.floor(duration / 1000 / 60)
        }
        return total
      }, 0)

      return {
        date: new Date(date),
        sessions: completedSessions,
        minutes: totalMinutes,
      }
    }).sort((a, b) => a.date.getTime() - b.date.getTime())

    return dailyStats
  }, [sessions])

  // Calculate max values for scaling
  const maxSessions = Math.max(...chartData.map(d => d.sessions), 3)
  const maxMinutes = Math.max(...chartData.map(d => d.minutes), 180)

  // Generate date labels based on time range
  const dateLabels = chartData.map(d => {
    if (timeRange === 'week') {
      return d.date.toLocaleDateString('en-US', { weekday: 'short' })
    } else {
      return d.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  })

  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-accent rounded-full" />
            <span className="text-sm text-muted">Sessions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-sm text-muted">Minutes</span>
          </div>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted">No data available for the selected period</p>
        </div>
      ) : (
        <div className="relative" style={{ height: '300px' }}>
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-muted pr-2">
            <span>{maxSessions}</span>
            <span>{Math.floor(maxSessions / 2)}</span>
            <span>0</span>
          </div>

          {/* Chart area */}
          <div className="ml-8 h-full relative">
            <div className="absolute inset-0 flex items-end justify-between gap-2">
              {chartData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center justify-end gap-1">
                  {/* Minutes bar */}
                  <div className="w-full flex justify-center">
                    <div
                      className="w-3 bg-blue-500 rounded-t transition-all duration-500"
                      style={{
                        height: `${(data.minutes / maxMinutes) * 250}px`,
                        opacity: 0.5,
                      }}
                      title={`${data.minutes} minutes`}
                    />
                  </div>
                  
                  {/* Sessions bar */}
                  <div className="w-full flex justify-center absolute bottom-0">
                    <div
                      className="w-3 bg-accent rounded-t transition-all duration-500"
                      style={{
                        height: `${(data.sessions / maxSessions) * 250}px`,
                      }}
                      title={`${data.sessions} sessions`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* X-axis labels */}
            <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-muted">
              {dateLabels.map((label, index) => (
                <span key={index} className="transform rotate-45 origin-left">
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 pt-4 border-t border-muted/20">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">
              {chartData.reduce((sum, d) => sum + d.sessions, 0)}
            </p>
            <p className="text-xs text-muted">Total Sessions</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">
              {(chartData.reduce((sum, d) => sum + d.minutes, 0) / 60).toFixed(1)}h
            </p>
            <p className="text-xs text-muted">Total Hours</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">
              {chartData.length > 0 
                ? (chartData.reduce((sum, d) => sum + d.sessions, 0) / chartData.length).toFixed(1)
                : '0'
              }
            </p>
            <p className="text-xs text-muted">Avg Sessions/Day</p>
          </div>
        </div>
      </div>
    </div>
  )
}
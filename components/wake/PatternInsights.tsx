'use client'

import { useMemo } from 'react'
import type { Database } from '@/lib/types/database'

type WorkSession = Database['public']['Tables']['work_sessions']['Row']

interface PatternInsightsProps {
  sessions: WorkSession[]
}

export function PatternInsights({ sessions }: PatternInsightsProps) {
  const formatHour = (hour: number) => {
    if (hour === 0) return '12 AM'
    if (hour === 12) return '12 PM'
    return hour > 12 ? `${hour - 12} PM` : `${hour} AM`
  }

  const insights = useMemo(() => {
    // Best day of week
    const dayStats = sessions.reduce((acc, session) => {
      const day = new Date(session.started_at).toLocaleDateString('en-US', { weekday: 'long' })
      if (!acc[day]) {
        acc[day] = { count: 0, completed: 0 }
      }
      acc[day].count++
      if (session.completed) {
        acc[day].completed++
      }
      return acc
    }, {} as Record<string, { count: number; completed: number }>)

    const bestDay = Object.entries(dayStats)
      .sort((a, b) => b[1].count - a[1].count)[0]

    // Best time of day
    const hourStats = sessions.reduce((acc, session) => {
      const hour = new Date(session.started_at).getHours()
      if (!acc[hour]) {
        acc[hour] = 0
      }
      acc[hour]++
      return acc
    }, {} as Record<number, number>)

    const bestHour = Object.entries(hourStats)
      .sort((a, b) => b[1] - a[1])[0]

    // Average session duration
    const completedSessions = sessions.filter(s => s.ended_at)
    const avgDuration = completedSessions.reduce((total, session) => {
      const duration = new Date(session.ended_at!).getTime() - new Date(session.started_at).getTime()
      return total + duration
    }, 0) / (completedSessions.length || 1) / 1000 / 60

    // Completion rate
    const completionRate = sessions.length > 0
      ? (sessions.filter(s => s.completed).length / sessions.length) * 100
      : 0

    // Streak calculation
    const sortedSessions = [...sessions].sort((a, b) => 
      new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
    )
    
    let currentStreak = 0
    let lastDate: Date | null = null
    
    for (const session of sortedSessions) {
      const sessionDate = new Date(session.started_at)
      sessionDate.setHours(0, 0, 0, 0)
      
      if (!lastDate) {
        currentStreak = 1
        lastDate = sessionDate
      } else {
        const dayDiff = Math.floor((lastDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))
        if (dayDiff === 1) {
          currentStreak++
          lastDate = sessionDate
        } else if (dayDiff > 1) {
          break
        }
      }
    }

    return {
      bestDay: bestDay?.[0] || 'No data',
      bestDayCount: bestDay?.[1].count || 0,
      bestTime: bestHour ? formatHour(parseInt(bestHour[0])) : 'No data',
      avgDuration: Math.round(avgDuration),
      completionRate: Math.round(completionRate),
      currentStreak,
    }
  }, [sessions])

  const insights_items = [
    {
      icon: '📅',
      label: 'Most Productive Day',
      value: insights.bestDay,
      subtext: `${insights.bestDayCount} sessions`,
    },
    {
      icon: '⏰',
      label: 'Peak Focus Time',
      value: insights.bestTime,
      subtext: 'Most frequent start time',
    },
    {
      icon: '⏱️',
      label: 'Average Duration',
      value: `${insights.avgDuration}m`,
      subtext: 'Per completed session',
    },
    {
      icon: '✅',
      label: 'Completion Rate',
      value: `${insights.completionRate}%`,
      subtext: 'Sessions completed',
    },
    {
      icon: '🔥',
      label: 'Current Streak',
      value: `${insights.currentStreak} days`,
      subtext: 'Keep it going!',
    },
  ]

  return (
    <div className="card">
      <div className="space-y-4">
        {insights_items.map((insight, index) => (
          <div key={index} className="flex items-start gap-3">
            <span className="text-2xl">{insight.icon}</span>
            <div className="flex-1">
              <div className="flex justify-between items-baseline">
                <h4 className="font-medium text-sm">{insight.label}</h4>
                <span className="font-bold text-primary">{insight.value}</span>
              </div>
              <p className="text-xs text-muted">{insight.subtext}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-muted/20">
        <h4 className="font-medium text-sm mb-2">Recommendations</h4>
        <ul className="space-y-1 text-xs text-muted">
          <li>• Schedule focus sessions on {insights.bestDay}s when possible</li>
          <li>• Start your expeditions around {insights.bestTime}</li>
          <li>• Aim to maintain your {insights.avgDuration}-minute sessions</li>
          {insights.completionRate < 80 && (
            <li>• Consider shorter sessions to improve completion rate</li>
          )}
        </ul>
      </div>
    </div>
  )
}
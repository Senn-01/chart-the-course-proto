'use client'

import type { Database } from '@/lib/types/database'

type Initiative = Database['public']['Tables']['initiatives']['Row'] & {
  work_sessions?: { count: number }[]
}

interface InitiativeProgressProps {
  initiatives: Initiative[]
}

export function InitiativeProgress({ initiatives }: InitiativeProgressProps) {
  // Sort initiatives by session count
  const sortedInitiatives = [...initiatives]
    .map(initiative => ({
      ...initiative,
      sessionCount: initiative.work_sessions?.[0]?.count || 0,
    }))
    .sort((a, b) => b.sessionCount - a.sessionCount)
    .slice(0, 10) // Top 10

  const maxSessions = Math.max(...sortedInitiatives.map(i => i.sessionCount), 1)

  const statusColors = {
    backlog: 'bg-gray-500',
    active: 'bg-green-500',
    completed: 'bg-blue-500',
    archived: 'bg-gray-400',
  }

  return (
    <div className="card">
      {sortedInitiatives.length === 0 ? (
        <p className="text-center text-muted py-8">
          No initiatives with focus sessions yet
        </p>
      ) : (
        <div className="space-y-4">
          {sortedInitiatives.map((initiative) => (
            <div key={initiative.id}>
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-medium text-sm truncate flex-1 mr-2">
                  {initiative.name}
                </h4>
                <span className="text-sm text-muted">
                  {initiative.sessionCount} sessions
                </span>
              </div>
              <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`absolute left-0 top-0 h-full ${statusColors[initiative.status]} transition-all duration-500`}
                  style={{
                    width: `${(initiative.sessionCount / maxSessions) * 100}%`,
                  }}
                />
                <div className="absolute inset-0 flex items-center px-2">
                  <span className="text-xs font-medium text-white mix-blend-difference">
                    {Math.round((initiative.sessionCount / maxSessions) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-muted/20">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Status Distribution:</span>
          <div className="flex gap-3">
            {Object.entries(statusColors).map(([status, color]) => {
              const count = initiatives.filter(i => i.status === status).length
              if (count === 0) return null
              return (
                <div key={status} className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded-full ${color}`} />
                  <span className="text-xs text-muted">
                    {status} ({count})
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
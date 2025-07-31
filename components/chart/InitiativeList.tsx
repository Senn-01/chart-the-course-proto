'use client'

import type { Database } from '@/lib/types/database'
import { formatDate } from '@/lib/utils/helpers'

type Initiative = Database['public']['Tables']['initiatives']['Row']

interface InitiativeListProps {
  initiatives: Initiative[]
  onInitiativeSelect: (initiative: Initiative) => void
  selectedInitiative: Initiative | null
  onInitiativeUpdate: (id: string, updates: Partial<Initiative>) => void
}

export function InitiativeList({ 
  initiatives, 
  onInitiativeSelect, 
  selectedInitiative,
  onInitiativeUpdate 
}: InitiativeListProps) {
  const statusColors = {
    backlog: 'bg-gray-100 text-gray-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    archived: 'bg-gray-100 text-gray-600',
  }

  const statusIcons = {
    backlog: '📋',
    active: '🚧',
    completed: '✅',
    archived: '📦',
  }

  return (
    <div className="space-y-4">
      {initiatives.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-muted text-lg mb-4">
            No initiatives plotted yet. Time to chart your course!
          </p>
        </div>
      ) : (
        initiatives.map(initiative => (
          <div
            key={initiative.id}
            onClick={() => onInitiativeSelect(initiative)}
            className={`card cursor-pointer transition-all hover:shadow-lg ${
              selectedInitiative?.id === initiative.id ? 'ring-2 ring-accent' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="heading-4 mb-1">{initiative.name}</h3>
                {initiative.description && (
                  <p className="text-sm text-muted">{initiative.description}</p>
                )}
              </div>
              <select
                value={initiative.status}
                onChange={(e) => {
                  e.stopPropagation()
                  onInitiativeUpdate(initiative.id, { status: e.target.value as Initiative['status'] })
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[initiative.status]}`}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="backlog">📋 Backlog</option>
                <option value="active">🚧 Active</option>
                <option value="completed">✅ Completed</option>
                <option value="archived">📦 Archived</option>
              </select>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted">Impact:</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={i < initiative.impact ? 'text-accent' : 'text-gray-300'}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted">Effort:</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={i < initiative.effort ? 'text-red-500' : 'text-gray-300'}
                    >
                      ●
                    </span>
                  ))}
                </div>
              </div>
              <div className="ml-auto text-xs text-muted">
                Created {formatDate(new Date(initiative.created_at))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
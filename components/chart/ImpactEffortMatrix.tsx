'use client'

import { useMemo } from 'react'
import type { Database } from '@/lib/types/database'

type Initiative = Database['public']['Tables']['initiatives']['Row']

interface ImpactEffortMatrixProps {
  initiatives: Initiative[]
  onInitiativeSelect: (initiative: Initiative) => void
  selectedInitiative: Initiative | null
  onInitiativeUpdate: (id: string, updates: Partial<Initiative>) => void
}

export function ImpactEffortMatrix({ 
  initiatives, 
  onInitiativeSelect, 
  selectedInitiative,
  onInitiativeUpdate 
}: ImpactEffortMatrixProps) {
  // Group initiatives by quadrant
  const quadrants = useMemo(() => {
    const grouped = {
      quickWins: [] as Initiative[],     // High Impact, Low Effort
      bigBets: [] as Initiative[],       // High Impact, High Effort
      fillIns: [] as Initiative[],       // Low Impact, Low Effort
      thankless: [] as Initiative[],     // Low Impact, High Effort
    }

    initiatives.forEach(initiative => {
      if (initiative.impact >= 3.5 && initiative.effort <= 2.5) {
        grouped.quickWins.push(initiative)
      } else if (initiative.impact >= 3.5 && initiative.effort > 2.5) {
        grouped.bigBets.push(initiative)
      } else if (initiative.impact < 3.5 && initiative.effort <= 2.5) {
        grouped.fillIns.push(initiative)
      } else {
        grouped.thankless.push(initiative)
      }
    })

    return grouped
  }, [initiatives])

  const quadrantInfo = [
    { key: 'quickWins', title: 'Quick Wins', emoji: '🎯', color: 'bg-green-50 border-green-200' },
    { key: 'bigBets', title: 'Big Bets', emoji: '🚀', color: 'bg-blue-50 border-blue-200' },
    { key: 'fillIns', title: 'Fill-Ins', emoji: '📌', color: 'bg-yellow-50 border-yellow-200' },
    { key: 'thankless', title: 'Consider Carefully', emoji: '⚠️', color: 'bg-red-50 border-red-200' },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Matrix Visualization */}
      <div className="lg:col-span-2">
        <div className="relative bg-white rounded-lg border border-muted/20 p-6" style={{ minHeight: '400px' }}>
          {/* Axis Labels */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-medium text-muted">
            Impact →
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm font-medium text-muted">
            Effort →
          </div>

          {/* Grid Lines */}
          <div className="absolute inset-6">
            <div className="absolute inset-0 border-2 border-gray-200" />
            <div className="absolute left-1/2 top-0 bottom-0 border-l-2 border-gray-200" />
            <div className="absolute top-1/2 left-0 right-0 border-t-2 border-gray-200" />
          </div>

          {/* Quadrant Labels */}
          <div className="absolute inset-6 grid grid-cols-2 grid-rows-2 gap-0">
            <div className="flex items-start justify-start p-3">
              <span className="text-xs font-medium text-green-600">Quick Wins</span>
            </div>
            <div className="flex items-start justify-end p-3">
              <span className="text-xs font-medium text-blue-600">Big Bets</span>
            </div>
            <div className="flex items-end justify-start p-3">
              <span className="text-xs font-medium text-yellow-600">Fill-Ins</span>
            </div>
            <div className="flex items-end justify-end p-3">
              <span className="text-xs font-medium text-red-600">Consider Carefully</span>
            </div>
          </div>

          {/* Plot Initiatives */}
          <div className="absolute inset-6">
            {initiatives.map(initiative => {
              const x = (initiative.effort / 5) * 100
              const y = 100 - (initiative.impact / 5) * 100
              
              return (
                <button
                  key={initiative.id}
                  onClick={() => onInitiativeSelect(initiative)}
                  className={`absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center text-sm font-medium transition-all hover:scale-110 ${
                    selectedInitiative?.id === initiative.id
                      ? 'bg-accent text-white ring-4 ring-accent/20'
                      : 'bg-primary text-white hover:bg-primary-dark'
                  }`}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  title={initiative.name}
                >
                  {initiative.name.charAt(0).toUpperCase()}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quadrants List */}
      {quadrantInfo.map(({ key, title, emoji, color }) => (
        <div key={key} className={`card ${color} border`}>
          <h3 className="heading-4 mb-3 flex items-center gap-2">
            <span className="text-xl">{emoji}</span>
            {title}
          </h3>
          <div className="space-y-2">
            {quadrants[key as keyof typeof quadrants].length === 0 ? (
              <p className="text-sm text-muted italic">No initiatives in this quadrant</p>
            ) : (
              quadrants[key as keyof typeof quadrants].map(initiative => (
                <div
                  key={initiative.id}
                  onClick={() => onInitiativeSelect(initiative)}
                  className={`p-3 bg-white rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                    selectedInitiative?.id === initiative.id ? 'ring-2 ring-accent' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-medium text-sm">{initiative.name}</h4>
                    <select
                      value={initiative.status}
                      onChange={(e) => {
                        e.stopPropagation()
                        onInitiativeUpdate(initiative.id, { status: e.target.value as Initiative['status'] })
                      }}
                      className="text-xs px-2 py-1 rounded border border-gray-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="backlog">Backlog</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  {initiative.description && (
                    <p className="text-xs text-muted line-clamp-2">{initiative.description}</p>
                  )}
                  <div className="flex gap-4 mt-2 text-xs text-muted">
                    <span>Impact: {initiative.impact}/5</span>
                    <span>Effort: {initiative.effort}/5</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
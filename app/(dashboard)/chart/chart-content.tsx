'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ImpactEffortMatrix } from '@/components/chart/ImpactEffortMatrix'
import { InitiativeForm } from '@/components/chart/InitiativeForm'
import { InitiativeList } from '@/components/chart/InitiativeList'
import type { Database } from '@/lib/types/database'

type Initiative = Database['public']['Tables']['initiatives']['Row']

interface ChartContentProps {
  initialInitiatives: Initiative[]
}

export function ChartContent({ initialInitiatives }: ChartContentProps) {
  const [initiatives, setInitiatives] = useState<Initiative[]>(initialInitiatives)
  const [showForm, setShowForm] = useState(false)
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | null>(null)
  const [viewMode, setViewMode] = useState<'matrix' | 'list'>('matrix')
  const supabase = createClient()

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('initiatives-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'initiatives',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setInitiatives((current) => [payload.new as Initiative, ...current])
          } else if (payload.eventType === 'UPDATE') {
            setInitiatives((current) =>
              current.map((initiative) =>
                initiative.id === payload.new.id ? (payload.new as Initiative) : initiative
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setInitiatives((current) =>
              current.filter((initiative) => initiative.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const handleInitiativeCreate = () => {
    setShowForm(false)
    setSelectedInitiative(null)
  }

  const handleInitiativeSelect = (initiative: Initiative) => {
    setSelectedInitiative(initiative)
  }

  const handleInitiativeUpdate = async (id: string, updates: Partial<Initiative>) => {
    const { error } = await supabase
      .from('initiatives')
      .update(updates)
      .eq('id', id)

    if (error) {
      console.error('Error updating initiative:', error)
    }
  }

  const activeInitiatives = initiatives.filter(i => i.status !== 'archived')

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="heading-1 mb-2">The Chart Room</h1>
        <p className="text-muted text-lg">
          Map your initiatives by impact and effort to navigate wisely
        </p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('matrix')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'matrix'
                ? 'bg-accent text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📊 Matrix View
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-accent text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📋 List View
          </button>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          📍 Plot New Course
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <InitiativeForm 
            onSubmit={handleInitiativeCreate}
            onCancel={() => {
              setShowForm(false)
              setSelectedInitiative(null)
            }}
            initialData={selectedInitiative}
          />
        </div>
      )}

      {viewMode === 'matrix' ? (
        <ImpactEffortMatrix 
          initiatives={activeInitiatives}
          onInitiativeSelect={handleInitiativeSelect}
          selectedInitiative={selectedInitiative}
          onInitiativeUpdate={handleInitiativeUpdate}
        />
      ) : (
        <InitiativeList 
          initiatives={activeInitiatives}
          onInitiativeSelect={handleInitiativeSelect}
          selectedInitiative={selectedInitiative}
          onInitiativeUpdate={handleInitiativeUpdate}
        />
      )}
    </div>
  )
}
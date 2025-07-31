'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { IdeaCard } from '@/components/ideas/IdeaCard'
import { IdeaForm } from '@/components/ideas/IdeaForm'
import { IdeaFilter } from '@/components/ideas/IdeaFilter'
import type { Database } from '@/lib/types/database'

type Idea = Database['public']['Tables']['ideas']['Row']

interface TerritoriesContentProps {
  initialIdeas: Idea[]
}

export function TerritoriesContent({ initialIdeas }: TerritoriesContentProps) {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas)
  const [filter, setFilter] = useState<'all' | 'captured' | 'explored' | 'archived'>('all')
  const [showForm, setShowForm] = useState(false)
  const supabase = createClient()

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('ideas-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ideas',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setIdeas((current) => [payload.new as Idea, ...current])
          } else if (payload.eventType === 'UPDATE') {
            setIdeas((current) =>
              current.map((idea) =>
                idea.id === payload.new.id ? (payload.new as Idea) : idea
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setIdeas((current) =>
              current.filter((idea) => idea.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const filteredIdeas = ideas.filter((idea) => {
    if (filter === 'all') return true
    return idea.status === filter
  })

  const handleIdeaCreate = async (idea: Idea) => {
    setShowForm(false)
    // The real-time subscription will handle adding it to the list
  }

  const handleIdeaStatusChange = (id: string, newStatus: Idea['status']) => {
    setIdeas((current) =>
      current.map((idea) =>
        idea.id === id ? { ...idea, status: newStatus } : idea
      )
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="heading-1 mb-2">Uncharted Territories</h1>
        <p className="text-muted text-lg">
          Capture fleeting insights before they vanish into the fog
        </p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
        <IdeaFilter currentFilter={filter} onFilterChange={setFilter} />
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          ⚓ Drop Anchor
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <IdeaForm 
            onSubmit={handleIdeaCreate}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredIdeas.map((idea) => (
          <IdeaCard 
            key={idea.id} 
            idea={idea} 
            onStatusChange={handleIdeaStatusChange}
          />
        ))}
        
        {filteredIdeas.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-muted text-lg mb-4">
              {filter === 'all' 
                ? "No ideas captured yet. Time to explore new territories!"
                : `No ${filter} ideas found.`}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => setShowForm(true)}
                className="btn-ghost"
              >
                Drop your first anchor
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
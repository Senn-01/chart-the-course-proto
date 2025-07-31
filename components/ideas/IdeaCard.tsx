'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from '@/lib/utils/helpers'
import type { Database } from '@/lib/types/database'

type Idea = Database['public']['Tables']['ideas']['Row']

interface IdeaCardProps {
  idea: Idea
  onStatusChange?: (id: string, newStatus: Idea['status']) => void
}

export function IdeaCard({ idea, onStatusChange }: IdeaCardProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const supabase = createClient()

  const handleStatusChange = async (newStatus: Idea['status']) => {
    setIsUpdating(true)
    
    // Optimistically update the UI
    if (onStatusChange) {
      onStatusChange(idea.id, newStatus)
    }
    
    const { data, error } = await supabase
      .from('ideas')
      .update({ status: newStatus })
      .eq('id', idea.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating idea status:', error)
      // Revert the optimistic update on error
      if (onStatusChange) {
        onStatusChange(idea.id, idea.status)
      }
    }
    
    setIsUpdating(false)
  }

  const statusColors = {
    captured: 'bg-blue-100 text-blue-800',
    explored: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-600',
  }

  const statusIcons = {
    captured: '🗺️',
    explored: '🧭',
    archived: '📦',
  }

  return (
    <div className="card group hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColors[idea.status]}`}>
          {statusIcons[idea.status]} {idea.status}
        </span>
        <span className="text-xs text-muted">
          {formatDistanceToNow(new Date(idea.created_at))}
        </span>
      </div>

      <h3 className="heading-4 mb-2 line-clamp-2">{idea.title}</h3>
      
      {idea.description && (
        <p className="text-sm text-muted mb-4 line-clamp-3">
          {idea.description}
        </p>
      )}

      {idea.tags && idea.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {idea.tags.map((tag) => (
            <span 
              key={tag}
              className="px-2 py-1 bg-accent/10 text-accent text-xs rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {idea.status === 'captured' && (
          <button
            onClick={() => handleStatusChange('explored')}
            disabled={isUpdating}
            className="btn-ghost text-sm"
            title="Mark as explored"
          >
            🧭 Explore
          </button>
        )}
        {idea.status !== 'archived' && (
          <button
            onClick={() => handleStatusChange('archived')}
            disabled={isUpdating}
            className="btn-ghost text-sm"
            title="Archive idea"
          >
            📦 Archive
          </button>
        )}
        {idea.status === 'archived' && (
          <button
            onClick={() => handleStatusChange('captured')}
            disabled={isUpdating}
            className="btn-ghost text-sm"
            title="Reactivate idea"
          >
            🗺️ Reactivate
          </button>
        )}
      </div>
    </div>
  )
}
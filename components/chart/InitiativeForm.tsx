'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { initiativeSchema } from '@/lib/utils/validation'
import type { Database } from '@/lib/types/database'

type Initiative = Database['public']['Tables']['initiatives']['Row']

interface InitiativeFormProps {
  onSubmit: () => void
  onCancel: () => void
  initialData?: Initiative | null
}

export function InitiativeForm({ onSubmit, onCancel, initialData }: InitiativeFormProps) {
  const [name, setName] = useState(initialData?.name || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [impact, setImpact] = useState(initialData?.impact || 3)
  const [effort, setEffort] = useState(initialData?.effort || 3)
  const [status, setStatus] = useState<Initiative['status']>(initialData?.status || 'backlog')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Validate input
      const data = initiativeSchema.parse({
        name,
        impact,
        effort,
        status,
      })

      const initiativeData = {
        ...data,
        description: description || null,
      }

      if (initialData) {
        // Update existing
        const { error: updateError } = await supabase
          .from('initiatives')
          .update(initiativeData)
          .eq('id', initialData.id)

        if (updateError) throw updateError
      } else {
        // Create new
        const { error: createError } = await supabase
          .from('initiatives')
          .insert(initiativeData)

        if (createError) throw createError
      }

      onSubmit()
    } catch (validationError) {
      if (validationError instanceof Error) {
        setError(validationError.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3 className="heading-4 mb-4">
        {initialData ? 'Update Initiative' : 'Plot New Course'}
      </h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-primary mb-1">
            Initiative Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            placeholder="e.g., Launch personal blog"
            required
            disabled={loading}
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-primary mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input min-h-[80px]"
            placeholder="What does this initiative involve?"
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="impact" className="block text-sm font-medium text-primary mb-1">
              Impact (1-5)
            </label>
            <div className="flex items-center gap-2">
              <input
                id="impact"
                type="range"
                min="1"
                max="5"
                value={impact}
                onChange={(e) => setImpact(Number(e.target.value))}
                className="flex-1"
                disabled={loading}
              />
              <span className="w-8 text-center font-medium">{impact}</span>
            </div>
            <p className="text-xs text-muted mt-1">
              How much will this move the needle?
            </p>
          </div>

          <div>
            <label htmlFor="effort" className="block text-sm font-medium text-primary mb-1">
              Effort (1-5)
            </label>
            <div className="flex items-center gap-2">
              <input
                id="effort"
                type="range"
                min="1"
                max="5"
                value={effort}
                onChange={(e) => setEffort(Number(e.target.value))}
                className="flex-1"
                disabled={loading}
              />
              <span className="w-8 text-center font-medium">{effort}</span>
            </div>
            <p className="text-xs text-muted mt-1">
              How much work will this require?
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-primary mb-1">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Initiative['status'])}
            className="input"
            disabled={loading}
          >
            <option value="backlog">Backlog</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="btn-ghost"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Plotting...' : initialData ? 'Update' : 'Plot Course'}
          </button>
        </div>
      </div>
    </form>
  )
}
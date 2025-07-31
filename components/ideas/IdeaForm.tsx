'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ideaSchema } from '@/lib/utils/validation'
import type { Database } from '@/lib/types/database'

type Idea = Database['public']['Tables']['ideas']['Row']

interface IdeaFormProps {
  onSubmit: (idea: Idea) => void
  onCancel: () => void
}

export function IdeaForm({ onSubmit, onCancel }: IdeaFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Parse tags
      const tagArray = tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0)

      // Validate input
      const data = ideaSchema.parse({
        title,
        description: description || undefined,
        tags: tagArray.length > 0 ? tagArray : undefined,
      })

      // Create idea - in dev mode with RLS disabled, we can insert without user_id
      const { data: newIdea, error: createError } = await supabase
        .from('ideas')
        .insert(data)
        .select()
        .single()

      if (createError) {
        setError(createError.message)
        return
      }

      if (newIdea) {
        onSubmit(newIdea)
      }
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
      <h3 className="heading-4 mb-4">Drop Anchor on New Territory</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-primary mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            placeholder="A brief title for your idea..."
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
            className="input min-h-[100px]"
            placeholder="Expand on your idea..."
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-primary mb-1">
            Tags
          </label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="input"
            placeholder="innovation, strategy, product (comma-separated)"
            disabled={loading}
          />
          <p className="mt-1 text-xs text-muted">
            Add tags to organize your ideas
          </p>
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
            {loading ? 'Dropping anchor...' : 'Drop Anchor'}
          </button>
        </div>
      </div>
    </form>
  )
}
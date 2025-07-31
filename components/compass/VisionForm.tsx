'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { visionDocumentSchema } from '@/lib/utils/validation'
import type { Database } from '@/lib/types/database'

type VisionDocument = Database['public']['Tables']['vision_documents']['Row']

interface VisionFormProps {
  onSubmit: (vision: Partial<VisionDocument>) => void
  onCancel: () => void
  initialData?: VisionDocument
}

export function VisionForm({ onSubmit, onCancel, initialData }: VisionFormProps) {
  const content = initialData?.content as {
    mission?: string
    values?: string[]
    goals?: string[]
    toolStack?: string[]
  } || {}

  const [mission, setMission] = useState(content.mission || '')
  const [values, setValues] = useState(content.values?.join(', ') || '')
  const [goals, setGoals] = useState(content.goals?.join('\n') || '')
  const [toolStack, setToolStack] = useState(content.toolStack?.join(', ') || '')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Parse and validate input
      const parsedValues = values.split(',').map(v => v.trim()).filter(v => v.length > 0)
      const parsedGoals = goals.split('\n').map(g => g.trim()).filter(g => g.length > 0)
      const parsedTools = toolStack.split(',').map(t => t.trim()).filter(t => t.length > 0)

      const data = visionDocumentSchema.parse({
        mission,
        values: parsedValues,
        goals: parsedGoals,
        toolStack: parsedTools,
      })

      // Save to database
      if (initialData) {
        // Update existing
        const { error: updateError } = await supabase
          .from('vision_documents')
          .update({ content: data })
          .eq('id', initialData.id)

        if (updateError) throw updateError
      } else {
        // Create new
        const { error: createError } = await supabase
          .from('vision_documents')
          .insert({ content: data })

        if (createError) throw createError
      }

      onSubmit({ content: data })
    } catch (validationError) {
      if (validationError instanceof Error) {
        setError(validationError.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h3 className="heading-4">
        {initialData ? 'Refine Your Vision' : 'Define Your North Star'}
      </h3>

      <div>
        <label htmlFor="mission" className="block text-sm font-medium text-primary mb-1">
          Mission Statement
        </label>
        <textarea
          id="mission"
          value={mission}
          onChange={(e) => setMission(e.target.value)}
          className="input min-h-[80px]"
          placeholder="What is your overarching purpose? What impact do you want to make?"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="values" className="block text-sm font-medium text-primary mb-1">
          Core Values
        </label>
        <input
          id="values"
          type="text"
          value={values}
          onChange={(e) => setValues(e.target.value)}
          className="input"
          placeholder="integrity, innovation, growth (comma-separated)"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="goals" className="block text-sm font-medium text-primary mb-1">
          North Star Goals
        </label>
        <textarea
          id="goals"
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          className="input min-h-[100px]"
          placeholder="Enter your long-term goals (one per line)"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="toolStack" className="block text-sm font-medium text-primary mb-1">
          Power Tools & Skills
        </label>
        <input
          id="toolStack"
          type="text"
          value={toolStack}
          onChange={(e) => setToolStack(e.target.value)}
          className="input"
          placeholder="Python, React, Leadership, Writing (comma-separated)"
          disabled={loading}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3 justify-end pt-2">
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
          {loading ? 'Saving...' : initialData ? 'Update Vision' : 'Set Course'}
        </button>
      </div>
    </form>
  )
}
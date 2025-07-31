'use client'

import type { Database } from '@/lib/types/database'

type VisionDocument = Database['public']['Tables']['vision_documents']['Row']

interface VisionDisplayProps {
  vision: VisionDocument
  onEdit: () => void
}

export function VisionDisplay({ vision, onEdit }: VisionDisplayProps) {
  const content = vision.content as {
    mission?: string
    values?: string[]
    goals?: string[]
    toolStack?: string[]
  }

  return (
    <div className="card space-y-6">
      {/* Mission */}
      {content.mission && (
        <div>
          <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
            <span className="text-xl">🎯</span>
            Mission Statement
          </h3>
          <p className="text-sm leading-relaxed">{content.mission}</p>
        </div>
      )}

      {/* Values */}
      {content.values && content.values.length > 0 && (
        <div>
          <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
            <span className="text-xl">⚓</span>
            Core Values
          </h3>
          <div className="flex flex-wrap gap-2">
            {content.values.map((value, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
              >
                {value}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Goals */}
      {content.goals && content.goals.length > 0 && (
        <div>
          <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
            <span className="text-xl">🏔️</span>
            North Star Goals
          </h3>
          <ul className="space-y-1">
            {content.goals.map((goal, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="text-muted mt-0.5">•</span>
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tool Stack */}
      {content.toolStack && content.toolStack.length > 0 && (
        <div>
          <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
            <span className="text-xl">🛠️</span>
            Power Tools
          </h3>
          <div className="flex flex-wrap gap-2">
            {content.toolStack.map((tool, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-muted/20">
        <button
          onClick={onEdit}
          className="btn-ghost text-sm"
        >
          ✏️ Refine Vision
        </button>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { LogEntry } from './LogEntry'
import type { Database } from '@/lib/types/database'

type LogEntryType = Database['public']['Tables']['log_entries']['Row']

interface LogHistoryProps {
  entries: LogEntryType[]
}

export function LogHistory({ entries }: LogHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Group entries by month
  const groupedEntries = entries.reduce((groups, entry) => {
    const date = new Date(entry.created_at)
    const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    
    if (!groups[monthYear]) {
      groups[monthYear] = []
    }
    groups[monthYear].push(entry)
    return groups
  }, {} as Record<string, LogEntryType[]>)

  if (entries.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-muted">No past entries yet. Start building your log!</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedEntries).map(([month, monthEntries]) => (
        <div key={month}>
          <h3 className="heading-4 mb-4">{month}</h3>
          <div className="space-y-4">
            {monthEntries.map((entry) => (
              <LogEntry 
                key={entry.id} 
                entry={entry} 
                isExpanded={expandedId === entry.id}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
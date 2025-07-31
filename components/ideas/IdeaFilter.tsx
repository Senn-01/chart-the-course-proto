'use client'

interface IdeaFilterProps {
  currentFilter: 'all' | 'captured' | 'explored' | 'archived'
  onFilterChange: (filter: 'all' | 'captured' | 'explored' | 'archived') => void
}

export function IdeaFilter({ currentFilter, onFilterChange }: IdeaFilterProps) {
  const filters = [
    { value: 'all' as const, label: 'All Ideas', icon: '🌊' },
    { value: 'captured' as const, label: 'Captured', icon: '🗺️' },
    { value: 'explored' as const, label: 'Explored', icon: '🧭' },
    { value: 'archived' as const, label: 'Archived', icon: '📦' },
  ]

  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`
            px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
            ${currentFilter === filter.value
              ? 'bg-accent text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          <span className="mr-1">{filter.icon}</span>
          {filter.label}
        </button>
      ))}
    </div>
  )
}
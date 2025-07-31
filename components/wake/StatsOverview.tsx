'use client'

interface StatsOverviewProps {
  analytics: {
    totalSessions: number
    totalHours: number
    completedInitiatives: number
    activeInitiatives: number
    ideasByStatus: {
      captured: number
      explored: number
      archived: number
    }
  }
}

export function StatsOverview({ analytics }: StatsOverviewProps) {
  const stats = [
    {
      label: 'Total Focus Hours',
      value: analytics.totalHours.toFixed(1),
      icon: '⏱️',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Completed Expeditions',
      value: analytics.totalSessions,
      icon: '🎯',
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Active Initiatives',
      value: analytics.activeInitiatives,
      icon: '🚀',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Ideas Captured',
      value: analytics.ideasByStatus.captured + analytics.ideasByStatus.explored,
      icon: '💡',
      color: 'bg-yellow-50 text-yellow-600',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className={`card ${stat.color}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{stat.icon}</span>
            <span className="text-3xl font-bold">{stat.value}</span>
          </div>
          <p className="text-sm font-medium">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}
'use client'

interface DailyProgressProps {
  completedSessions: number
  totalMinutes: number
  targetSessions: number
}

export function DailyProgress({ 
  completedSessions, 
  totalMinutes, 
  targetSessions 
}: DailyProgressProps) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  const progressPercentage = Math.min((completedSessions / targetSessions) * 100, 100)

  return (
    <div className="card">
      <h3 className="heading-4 mb-4">Today&apos;s Progress</h3>
      
      <div className="space-y-4">
        {/* Sessions Progress */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">Expeditions</span>
            <span className="text-muted">{completedSessions} / {targetSessions}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Time Invested */}
        <div className="text-center py-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-muted mb-1">Deep Work Today</p>
          <p className="text-2xl font-bold text-primary">
            {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}
          </p>
        </div>

        {/* Achievement Badges */}
        <div className="flex justify-center gap-3">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl
                ${completedSessions >= num 
                  ? 'bg-accent text-white' 
                  : 'bg-gray-200 text-gray-400'
                }`}
            >
              {num === 1 ? '🌊' : num === 2 ? '⛵' : '🏆'}
            </div>
          ))}
        </div>

        {/* Motivational Message */}
        <div className="text-center text-sm text-muted italic pt-2">
          {completedSessions === 0 
            ? "Ready to set sail?" 
            : completedSessions < targetSessions
            ? "Keep navigating!"
            : "Outstanding voyage today! 🎉"
          }
        </div>
      </div>
    </div>
  )
}
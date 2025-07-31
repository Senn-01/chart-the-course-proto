'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const modules = [
  {
    name: 'Uncharted Territories',
    href: '/territories',
    icon: '🗺️',
    description: 'Capture ideas',
  },
  {
    name: 'True North Compass',
    href: '/compass',
    icon: '🧭',
    description: 'Define vision',
  },
  {
    name: 'The Chart Room',
    href: '/chart',
    icon: '📊',
    description: 'Map initiatives',
  },
  {
    name: 'The Daily Expedition',
    href: '/expedition',
    icon: '⏱️',
    description: 'Focus sessions',
  },
  {
    name: "Captain's Log",
    href: '/log',
    icon: '📝',
    description: 'Daily reflection',
  },
  {
    name: 'Reading the Wake',
    href: '/wake',
    icon: '📈',
    description: 'View progress',
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="w-20 lg:w-64 bg-white border-r border-muted/20 flex flex-col">
      <div className="p-4 lg:p-6">
        <Link href="/territories" className="block">
          <h1 className="text-xl lg:text-2xl font-serif font-bold text-primary text-center lg:text-left">
            <span className="hidden lg:inline">Chart The Course</span>
            <span className="lg:hidden">CTC</span>
          </h1>
        </Link>
      </div>

      <nav className="flex-1 px-2 lg:px-4 pb-4">
        <ul className="space-y-1">
          {modules.map((module) => {
            const isActive = pathname === module.href
            return (
              <li key={module.href}>
                <Link
                  href={module.href as any}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-accent/10 text-accent' 
                      : 'text-primary hover:bg-gray-50'
                    }
                  `}
                  title={module.name}
                >
                  <span className="text-2xl">{module.icon}</span>
                  <div className="hidden lg:block">
                    <div className="font-medium text-sm">{module.name}</div>
                    <div className="text-xs text-muted">{module.description}</div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-muted/20">
        <button
          onClick={handleSignOut}
          className="w-full btn-ghost text-sm justify-center"
        >
          <span className="lg:hidden">👋</span>
          <span className="hidden lg:inline">Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
import { NavLink } from 'react-router-dom'
import { CalendarDays, FileText, LayoutDashboard, Settings, Bell, Search } from 'lucide-react'

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Today' },
  { to: '/events', icon: CalendarDays, label: 'Events' },
  { to: '/notes', icon: FileText, label: 'Notes' },
  { to: '/reminders', icon: Bell, label: 'Reminders' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

type Props = { userPicture?: string; userName?: string; onOpenSearch: () => void }

export function Sidebar({ userPicture, userName, onOpenSearch }: Props) {
  return (
    <aside className="hidden md:flex flex-col w-52 min-h-screen bg-surface border-r border-border shrink-0">
      {/* Logo row */}
      <div className="px-4 py-4 border-b border-border">
        <span className="text-sm font-bold text-text-primary tracking-tight">AbbyWorld</span>
        <div className="w-5 h-0.5 bg-primary mt-1.5" />
      </div>

      {/* Search */}
      <div className="border-b border-border">
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-4 py-3 text-text-tertiary hover:text-primary hover:bg-panel transition-all duration-150 text-sm w-full"
        >
          <Search size={13} />
          <span className="flex-1 text-left">search</span>
          <kbd className="text-[10px] text-text-tertiary bg-panel px-1.5 py-0.5 font-mono border border-border">⌘K</kbd>
        </button>
      </div>

      {/* Nav links — each separated by a border */}
      <nav className="flex flex-col flex-1 divide-y divide-border">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-4 py-3 text-sm transition-all duration-150',
                isActive
                  ? 'text-primary bg-primary-light font-bold'
                  : 'text-text-secondary hover:text-primary hover:bg-panel',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={14} strokeWidth={isActive ? 2.5 : 1.5} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User row */}
      {userPicture && (
        <div className="flex items-center gap-2.5 px-4 py-3 border-t border-border">
          <img src={userPicture} alt={userName} className="w-5 h-5 rounded-full ring-1 ring-border" />
          <span className="text-[11px] text-text-tertiary truncate">{userName}</span>
        </div>
      )}
    </aside>
  )
}

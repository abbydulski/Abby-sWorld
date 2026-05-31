import { NavLink, Outlet } from 'react-router-dom'
import { CalendarDays, FileText, LayoutDashboard, Settings, Bell } from 'lucide-react'
import { Sidebar } from './Sidebar'

const mobileLinks = [
  { to: '/', icon: LayoutDashboard, label: 'Today' },
  { to: '/events', icon: CalendarDays, label: 'Events' },
  { to: '/notes', icon: FileText, label: 'Notes' },
  { to: '/reminders', icon: Bell, label: 'Reminders' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

type Props = { userPicture?: string; userName?: string; onOpenSearch: () => void }

export function Layout({ userPicture, userName, onOpenSearch }: Props) {
  return (
    <div className="flex min-h-screen bg-bg font-sans relative">
      <Sidebar userPicture={userPicture} userName={userName} onOpenSearch={onOpenSearch} />

      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Outlet />
      </div>

      {/* Mobile bottom nav — divided */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-surface border-t border-border flex divide-x divide-border z-40">
        {mobileLinks.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              [
                'flex-1 flex flex-col items-center gap-0.5 py-3 text-[10px] transition-colors duration-150',
                isActive ? 'text-primary bg-primary-light font-bold' : 'text-text-tertiary',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={15} strokeWidth={isActive ? 2.5 : 1.5} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

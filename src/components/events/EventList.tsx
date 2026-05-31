import { format } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import { EventCard } from './EventCard'
import { EmptyState } from '../ui/EmptyState'
import { groupByDate } from '../../lib/utils'
import type { UnifiedEvent } from '../../types/event'

type Props = { events: UnifiedEvent[]; onSelect: (event: UnifiedEvent) => void }

export function EventList({ events, onSelect }: Props) {
  if (events.length === 0) return <EmptyState icon={CalendarDays} message="No events to show" />

  const grouped = groupByDate(events)

  return (
    <div className="flex flex-col">
      {Array.from(grouped.entries()).map(([dateKey, dayEvents]) => (
        <div key={dateKey}>
          <div className="px-7 py-2.5 border-b border-border-soft">
            <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-widest">
              {format(new Date(dateKey + 'T00:00:00'), 'EEEE, MMMM d')}
            </span>
          </div>
          <div className="divide-y divide-border-soft">
            {dayEvents.map((event) => (
              <EventCard key={event.id} event={event} onClick={() => onSelect(event)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

import { formatTime } from '../../lib/utils'
import type { UnifiedEvent } from '../../types/event'

type Props = {
  event: UnifiedEvent
  onClick: () => void
}

export function EventCard({ event, onClick }: Props) {
  const hasReminder = !!event.reminder
  const timeLabel = event.allDay ? 'All day' : formatTime(event.start)

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-panel transition-colors duration-150 text-left"
    >
      <span className="text-[11px] text-text-tertiary w-14 shrink-0">{timeLabel}</span>

      <div className="flex-1 min-w-0">
        <span className="text-sm text-text-primary truncate block">{event.title}</span>
        {event.description && (
          <span className="text-[12px] text-text-tertiary truncate block mt-0.5">{event.description}</span>
        )}
      </div>

      {hasReminder && <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />}
    </button>
  )
}

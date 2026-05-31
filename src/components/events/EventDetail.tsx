import { useState } from 'react'
import { X, Clock, FileText } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '../ui/Button'
import { ReminderPicker } from './ReminderPicker'
import { Badge } from '../ui/Badge'
import { useReminders } from '../../hooks/useReminders'
import { useNotes } from '../../hooks/useNotes'
import type { UnifiedEvent } from '../../types/event'

type Props = {
  event: UnifiedEvent
  onClose: () => void
  onAddNote: () => void
}

export function EventDetail({ event, onClose, onAddNote }: Props) {
  const { reminders, create: createReminder, remove: removeReminder } = useReminders()
  const { notes } = useNotes()

  const existingReminder = reminders.find((r) => r.eventId === event.id && !r.fired)
  const [reminderMinutes, setReminderMinutes] = useState<number | null>(
    existingReminder?.offsetMinutes ?? null,
  )

  const linkedNotes = notes.filter((n) => n.linkedEventId === event.id)

  async function handleReminderChange(minutes: number | null) {
    setReminderMinutes(minutes)
    if (existingReminder) await removeReminder.mutateAsync(existingReminder.id)
    if (minutes !== null) await createReminder.mutateAsync({ event, offsetMinutes: minutes })
  }

  return (
    <div className="absolute inset-y-0 right-0 w-96 bg-surface border-l border-border-soft flex flex-col z-40">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-soft">
        <span className="text-sm font-medium text-text-primary truncate">{event.title}</span>
        <button onClick={onClose} className="text-text-tertiary hover:text-text-primary transition-colors duration-150 ml-2 shrink-0 p-0.5 rounded hover:bg-panel">
          <X size={15} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">
        <div className="flex items-start gap-2.5">
          <Clock size={14} className="text-text-tertiary mt-0.5 shrink-0" />
          <div>
            <span className="text-sm text-text-primary">
              {event.allDay ? 'All day' : `${format(event.start, 'h:mm a')} – ${format(event.end, 'h:mm a')}`}
            </span>
            <p className="text-[12px] text-text-tertiary mt-0.5">{format(event.start, 'EEEE, MMMM d, yyyy')}</p>
          </div>
        </div>

        {event.description && (
          <p className="text-sm text-text-secondary leading-relaxed">{event.description}</p>
        )}

        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-widest">Reminder</span>
          <ReminderPicker value={reminderMinutes} onChange={handleReminderChange} />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-widest">Notes</span>
            <button onClick={onAddNote} className="text-[12px] text-primary hover:text-primary/80 transition-colors duration-150">Add note</button>
          </div>
          {linkedNotes.length === 0 ? (
            <p className="text-[12px] text-text-tertiary">No notes linked</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {linkedNotes.map((note) => (
                <div key={note.id} className="flex items-center gap-2 p-2.5 rounded-lg bg-panel">
                  <FileText size={13} className="text-text-tertiary shrink-0" />
                  <span className="text-sm text-text-primary truncate">{note.title || 'Untitled'}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <Badge color="gray">{event.source === 'google' ? 'Google Calendar' : 'Manual'}</Badge>
      </div>

      <div className="px-5 py-4 border-t border-border-soft">
        <Button variant="ghost" onClick={onClose} className="w-full justify-center">Close</Button>
      </div>
    </div>
  )
}

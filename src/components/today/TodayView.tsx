import { isSameDay, isPast, isToday } from 'date-fns'
import { Plus } from 'lucide-react'
import { formatDate } from '../../lib/utils'
import { EventCard } from '../events/EventCard'
import { NoteCard } from '../notes/NoteCard'
import { ReminderItem } from '../reminders/ReminderItem'
import { EmailSummary } from '../email/EmailSummary'
import { Button } from '../ui/Button'
import type { UnifiedEvent } from '../../types/event'
import type { Note } from '../../types/note'
import type { StandaloneReminder } from '../../types/standaloneReminder'
import type { EmailSummary as EmailSummaryType } from '../../hooks/useEmailSummary'

type Props = {
  events: UnifiedEvent[]
  notes: Note[]
  reminders: StandaloneReminder[]
  emailSummary?: EmailSummaryType
  emailLoading: boolean
  unreadCount: number
  isSignedIn: boolean
  onSelectEvent: (event: UnifiedEvent) => void
  onSelectNote: (note: Note) => void
  onCompleteReminder: (id: string) => void
  onDeleteReminder: (id: string) => void
  onEditReminder: (reminder: StandaloneReminder) => void
  onAddReminder: () => void
  onSignIn: () => void
}

export function TodayView({
  events, notes, reminders, emailSummary, emailLoading,
  unreadCount, isSignedIn, onSelectEvent, onSelectNote,
  onCompleteReminder, onDeleteReminder, onEditReminder, onAddReminder, onSignIn,
}: Props) {
  const today = new Date()
  const todayEvents = events.filter((e) => isSameDay(e.start, today)).sort((a, b) => a.start.getTime() - b.start.getTime())
  const dueReminders = reminders.filter((r) => !r.completed && (isToday(r.dueAt) || isPast(r.dueAt))).sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime())
  const upcomingReminders = reminders.filter((r) => !r.completed && !isToday(r.dueAt) && !isPast(r.dueAt)).sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime()).slice(0, 3)
  const recentNotes = notes.filter((n) => isSameDay(n.updatedAt, today)).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, 4)
  const pinnedNotes = notes.filter((n) => n.pinned).slice(0, 4)
  const shownNotes = recentNotes.length > 0 ? recentNotes : pinnedNotes
  const eventMap = new Map(events.map((e) => [e.id, e.title]))

  return (
    <div className="flex flex-col divide-y divide-border">
      {/* Header */}
      <div className="px-6 py-5 bg-surface">
        <p className="text-[10px] text-text-tertiary uppercase tracking-widest mb-1">{formatDate(today).split(',')[0]}</p>
        <h1 className="text-xl font-bold text-text-primary tracking-tight">{formatDate(today).split(', ').slice(1).join(', ')}</h1>
      </div>

      {!isSignedIn && (
        <div className="flex items-center justify-between px-6 py-3 bg-primary-light">
          <span className="text-xs text-primary">connect google to see your calendar + emails</span>
          <Button onClick={onSignIn} className="text-xs py-1 px-2.5 ml-3 shrink-0">connect</Button>
        </div>
      )}

      {/* Reminders section */}
      <div>
        <div className="flex items-center justify-between px-6 py-2.5 border-b border-border bg-panel">
          <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">reminders</span>
          <button onClick={onAddReminder} className="flex items-center gap-1 text-[10px] text-text-tertiary hover:text-primary transition-colors duration-150">
            <Plus size={10} />add
          </button>
        </div>
        {[...dueReminders, ...upcomingReminders].length === 0 ? (
          <button onClick={onAddReminder} className="flex items-center gap-2 px-6 py-3 text-xs text-text-tertiary hover:text-primary transition-colors duration-150 w-full">
            <Plus size={12} />add a reminder
          </button>
        ) : (
          <div className="divide-y divide-border">
            {[...dueReminders, ...upcomingReminders].map((r) => (
              <ReminderItem key={r.id} reminder={r} onComplete={() => onCompleteReminder(r.id)} onDelete={() => onDeleteReminder(r.id)} onEdit={() => onEditReminder(r)} />
            ))}
          </div>
        )}
      </div>

      {/* Today's events */}
      <div>
        <div className="flex items-center px-6 py-2.5 border-b border-border bg-panel">
          <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">today</span>
        </div>
        {todayEvents.length === 0 ? (
          <p className="px-6 py-3 text-xs text-text-tertiary">nothing scheduled</p>
        ) : (
          <div className="divide-y divide-border">
            {todayEvents.map((event) => <EventCard key={event.id} event={event} onClick={() => onSelectEvent(event)} />)}
          </div>
        )}
      </div>

      {/* Email summary */}
      {isSignedIn && (
        <div>
          <div className="flex items-center justify-between px-6 py-2.5 border-b border-border bg-panel">
            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">inbox</span>
            <span className="text-[10px] text-text-tertiary">{unreadCount} unread</span>
          </div>
          <EmailSummary summary={emailSummary} isLoading={emailLoading} unreadCount={unreadCount} hideSectionHeader />
        </div>
      )}

      {/* Notes */}
      {shownNotes.length > 0 && (
        <div>
          <div className="flex items-center px-6 py-2.5 border-b border-border bg-panel">
            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
              {recentNotes.length > 0 ? 'notes today' : 'pinned'}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y divide-border sm:divide-y-0">
            {shownNotes.map((note) => (
              <div key={note.id} className="border-b border-border sm:border-b-0 sm:border-r last:border-r-0">
                <NoteCard note={note} eventTitle={note.linkedEventId ? eventMap.get(note.linkedEventId) : undefined} onClick={() => onSelectNote(note)} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

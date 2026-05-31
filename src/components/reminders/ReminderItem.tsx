import { format, isPast, isToday } from 'date-fns'
import { Check, RefreshCw, Trash2 } from 'lucide-react'
import type { StandaloneReminder } from '../../types/standaloneReminder'

type Props = {
  reminder: StandaloneReminder
  onComplete: () => void
  onDelete: () => void
  onEdit: () => void
}

const RECURRENCE_LABELS: Record<string, string> = {
  daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly',
}

export function ReminderItem({ reminder, onComplete, onDelete, onEdit }: Props) {
  const overdue = isPast(reminder.dueAt) && !isToday(reminder.dueAt) && !reminder.completed
  const dueToday = isToday(reminder.dueAt)

  return (
    <div className={['flex items-start gap-3 px-4 py-3 group transition-colors duration-150', overdue ? 'bg-rose-light' : 'hover:bg-panel'].join(' ')}>
      <button
        onClick={onComplete}
        className={[
          'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-150',
          reminder.completed
            ? 'bg-primary border-primary text-white'
            : overdue
            ? 'border-primary hover:bg-primary-light'
            : 'border-border hover:border-primary',
        ].join(' ')}
      >
        {reminder.completed && <Check size={10} strokeWidth={3} />}
      </button>

      <button onClick={onEdit} className="flex-1 text-left min-w-0">
        <span className={['text-sm block', reminder.completed ? 'line-through text-text-tertiary' : 'text-text-primary'].join(' ')}>
          {reminder.title}
        </span>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={['text-[11px]', overdue ? 'text-primary font-medium' : dueToday ? 'text-primary font-medium' : 'text-text-tertiary'].join(' ')}>
            {dueToday ? `Today, ${format(reminder.dueAt, 'h:mm a')}` : format(reminder.dueAt, 'MMM d, h:mm a')}
          </span>
          {reminder.recurrence !== 'none' && (
            <span className="flex items-center gap-0.5 text-[11px] text-text-tertiary">
              <RefreshCw size={9} />{RECURRENCE_LABELS[reminder.recurrence]}
            </span>
          )}
        </div>
        {reminder.notes && <span className="text-[12px] text-text-tertiary mt-0.5 block truncate">{reminder.notes}</span>}
      </button>

      <button onClick={onDelete} className="opacity-0 group-hover:opacity-100 text-border hover:text-primary transition-all duration-150 shrink-0 mt-0.5">
        <Trash2 size={13} />
      </button>
    </div>
  )
}

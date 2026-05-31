import { useState } from 'react'
import { format } from 'date-fns'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import type { StandaloneReminder, RecurrenceType } from '../../types/standaloneReminder'

type Props = {
  reminder?: StandaloneReminder
  onSave: (data: Omit<StandaloneReminder, 'id' | 'completed'>) => void
  onClose: () => void
}

const RECURRENCE_OPTIONS: { label: string; value: RecurrenceType }[] = [
  { label: 'Once', value: 'none' },
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
]

export function ReminderForm({ reminder, onSave, onClose }: Props) {
  const [title, setTitle] = useState(reminder?.title ?? '')
  const [notes, setNotes] = useState(reminder?.notes ?? '')
  const [dueStr, setDueStr] = useState(
    reminder ? format(reminder.dueAt, "yyyy-MM-dd'T'HH:mm") : '',
  )
  const [recurrence, setRecurrence] = useState<RecurrenceType>(reminder?.recurrence ?? 'none')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !dueStr) return
    onSave({ title: title.trim(), notes: notes.trim() || undefined, dueAt: new Date(dueStr), recurrence })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Reminder title"
        required
        autoFocus
      />

      <Input
        label="Due"
        type="datetime-local"
        value={dueStr}
        onChange={(e) => setDueStr(e.target.value)}
        required
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] text-text-secondary font-medium">Repeats</label>
        <div className="flex gap-2">
          {RECURRENCE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRecurrence(opt.value)}
              className={[
                'flex-1 py-1.5 rounded border text-sm transition-colors duration-150',
                recurrence === opt.value
                  ? 'border-primary bg-primary-light text-primary font-medium'
                  : 'border-border text-text-secondary hover:bg-primary-light hover:text-primary',
              ].join(' ')}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Textarea
        label="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Optional notes..."
        rows={3}
      />

      <div className="flex gap-2 justify-end pt-1">
        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
        <Button type="submit">{reminder ? 'Save' : 'Add reminder'}</Button>
      </div>
    </form>
  )
}

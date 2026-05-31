import { useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { useManualEvents } from '../../hooks/useManualEvents'
import type { UnifiedEvent } from '../../types/event'

type Props = {
  onClose: () => void
  onCreated?: (event: UnifiedEvent) => void
}

export function EventForm({ onClose, onCreated }: Props) {
  const { create } = useManualEvents()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startStr, setStartStr] = useState('')
  const [endStr, setEndStr] = useState('')
  const [allDay, setAllDay] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !startStr) return

    const start = new Date(startStr)
    const end = endStr ? new Date(endStr) : new Date(start.getTime() + 60 * 60 * 1000)

    const event = await create.mutateAsync({
      title: title.trim(),
      description: description.trim() || undefined,
      start,
      end,
      allDay,
      linkedNoteIds: [],
    })
    onCreated?.(event)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Event title"
        required
        autoFocus
      />

      <Textarea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Optional description"
        rows={3}
      />

      <div className="flex items-center gap-2">
        <input
          id="allDay"
          type="checkbox"
          checked={allDay}
          onChange={(e) => setAllDay(e.target.checked)}
          className="accent-primary"
        />
        <label htmlFor="allDay" className="text-sm text-text-secondary">
          All day
        </label>
      </div>

      {!allDay && (
        <div className="flex gap-3">
          <Input
            label="Start"
            type="datetime-local"
            value={startStr}
            onChange={(e) => setStartStr(e.target.value)}
            required
            className="flex-1"
          />
          <Input
            label="End"
            type="datetime-local"
            value={endStr}
            onChange={(e) => setEndStr(e.target.value)}
            className="flex-1"
          />
        </div>
      )}

      {allDay && (
        <Input
          label="Date"
          type="date"
          value={startStr.split('T')[0]}
          onChange={(e) => setStartStr(e.target.value)}
          required
        />
      )}

      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={create.isPending}>
          Create event
        </Button>
      </div>
    </form>
  )
}

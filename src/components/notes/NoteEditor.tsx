import { useState } from 'react'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { X } from 'lucide-react'
import type { Note } from '../../types/note'
import type { UnifiedEvent } from '../../types/event'

type Props = {
  note?: Note
  events: UnifiedEvent[]
  onSave: (data: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void
  onDelete?: () => void
  onClose: () => void
}

export function NoteEditor({ note, events, onSave, onDelete, onClose }: Props) {
  const [title, setTitle] = useState(note?.title ?? '')
  const [body, setBody] = useState(note?.body ?? '')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(note?.tags ?? [])
  const [linkedEventId, setLinkedEventId] = useState(note?.linkedEventId ?? '')

  function addTags() {
    const newTags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t && !tags.includes(t))
    setTags([...tags, ...newTags])
    setTagInput('')
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag))
  }

  function handleTagKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTags()
    }
  }

  function handleSave() {
    onSave({
      title: title.trim(),
      body: body.trim(),
      tags,
      linkedEventId: linkedEventId || undefined,
    })
    onClose()
  }

  return (
    <div className="flex flex-col gap-5 h-full">
      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title"
        autoFocus
      />

      <Textarea
        label="Content"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write something..."
        rows={10}
        className="flex-1"
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] text-text-secondary font-medium">Tags</label>
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          {tags.map((tag) => (
            <Badge key={tag} color="gray">
              {tag}
              <button onClick={() => removeTag(tag)} className="ml-1 hover:text-text-primary">
                <X size={10} />
              </button>
            </Badge>
          ))}
        </div>
        <Input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          onBlur={addTags}
          placeholder="Add tags, comma-separated"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[12px] text-text-secondary font-medium">Link to event</label>
        <select
          value={linkedEventId}
          onChange={(e) => setLinkedEventId(e.target.value)}
          className="w-full py-1.5 px-2 rounded border border-border bg-surface text-sm text-text-primary focus:outline-none focus:border-primary transition-colors duration-150"
        >
          <option value="">None</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2 justify-between pt-2 border-t border-border">
        {onDelete && (
          <Button variant="ghost" onClick={onDelete} className="text-red-500 hover:bg-red-50">
            Delete
          </Button>
        )}
        <div className="flex gap-2 ml-auto">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>
  )
}

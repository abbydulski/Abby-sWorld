import { FileText } from 'lucide-react'
import { NoteCard } from './NoteCard'
import { EmptyState } from '../ui/EmptyState'
import type { Note } from '../../types/note'
import type { UnifiedEvent } from '../../types/event'

type Props = {
  notes: Note[]
  events: UnifiedEvent[]
  onSelect: (note: Note) => void
  onPin: (id: string) => void
}

export function NoteList({ notes, events, onSelect, onPin }: Props) {
  if (notes.length === 0) return <EmptyState icon={FileText} message="No notes yet" />

  const eventMap = new Map(events.map((e) => [e.id, e.title]))
  const pinned = notes.filter((n) => n.pinned)
  const rest = notes.filter((n) => !n.pinned)

  return (
    <div className="px-7 py-6 flex flex-col gap-6">
      {pinned.length > 0 && (
        <div>
          <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-widest mb-3">Pinned</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {pinned.map((note) => (
              <NoteCard key={note.id} note={note} eventTitle={note.linkedEventId ? eventMap.get(note.linkedEventId) : undefined} onClick={() => onSelect(note)} onPin={() => onPin(note.id)} />
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {rest.map((note) => (
          <NoteCard key={note.id} note={note} eventTitle={note.linkedEventId ? eventMap.get(note.linkedEventId) : undefined} onClick={() => onSelect(note)} onPin={() => onPin(note.id)} />
        ))}
      </div>
    </div>
  )
}

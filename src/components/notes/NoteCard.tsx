import { CalendarDays, Pin } from 'lucide-react'
import { format } from 'date-fns'
import { Badge } from '../ui/Badge'
import { truncate } from '../../lib/utils'
import type { Note } from '../../types/note'

type Props = { note: Note; eventTitle?: string; onClick: () => void; onPin?: () => void }

export function NoteCard({ note, eventTitle, onClick, onPin }: Props) {
  return (
    <div className="relative group bg-surface rounded-lg shadow-card hover:shadow-card-hover transition-all duration-150 flex flex-col">
      <button onClick={onClick} className="flex flex-col gap-2 p-4 text-left flex-1">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-medium text-text-primary leading-snug">{note.title || 'Untitled'}</span>
          {note.pinned && <Pin size={12} className="text-primary shrink-0 mt-0.5" />}
        </div>

        {note.body && (
          <p className="text-[12px] text-text-secondary leading-relaxed line-clamp-2">{truncate(note.body, 120)}</p>
        )}

        <div className="flex flex-wrap gap-1.5 items-center mt-auto pt-1">
          {note.tags.map((tag) => <Badge key={tag} color="gray">{tag}</Badge>)}
          {eventTitle && (
            <Badge color="blue">
              <CalendarDays size={9} className="mr-1" />
              {truncate(eventTitle, 18)}
            </Badge>
          )}
          <span className="text-[11px] text-text-tertiary ml-auto">{format(note.updatedAt, 'MMM d')}</span>
        </div>
      </button>

      {onPin && (
        <button
          onClick={(e) => { e.stopPropagation(); onPin() }}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-text-tertiary hover:text-primary p-1 rounded"
          title={note.pinned ? 'Unpin' : 'Pin'}
        >
          <Pin size={12} />
        </button>
      )}
    </div>
  )
}

import { useEffect, useRef, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, FileText, CalendarDays, Bell, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import type { Note } from '../types/note'
import type { UnifiedEvent } from '../types/event'
import type { StandaloneReminder } from '../types/standaloneReminder'

type ResultItem =
  | { kind: 'note'; note: Note }
  | { kind: 'event'; event: UnifiedEvent }
  | { kind: 'reminder'; reminder: StandaloneReminder }
  | { kind: 'action'; label: string; shortcut?: string; action: () => void }

type Props = {
  notes: Note[]
  events: UnifiedEvent[]
  reminders: StandaloneReminder[]
  onClose: () => void
  onNewNote: () => void
  onNewReminder: () => void
  onNewEvent: () => void
  onSelectNote: (note: Note) => void
  onSelectEvent: (event: UnifiedEvent) => void
}

export function CommandPalette({ notes, events, reminders, onClose, onNewNote, onNewReminder, onNewEvent, onSelectNote, onSelectEvent }: Props) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => { inputRef.current?.focus() }, [])

  const results = useMemo<ResultItem[]>(() => {
    const q = query.toLowerCase().trim()
    if (!q) {
      return [
        { kind: 'action', label: 'New note', shortcut: 'N', action: () => { onNewNote(); onClose() } },
        { kind: 'action', label: 'New reminder', shortcut: 'R', action: () => { onNewReminder(); onClose() } },
        { kind: 'action', label: 'New event', shortcut: 'E', action: () => { onNewEvent(); onClose() } },
        { kind: 'action', label: 'Go to Today', action: () => { navigate('/'); onClose() } },
        { kind: 'action', label: 'Go to Events', action: () => { navigate('/events'); onClose() } },
        { kind: 'action', label: 'Go to Notes', action: () => { navigate('/notes'); onClose() } },
        { kind: 'action', label: 'Go to Reminders', action: () => { navigate('/reminders'); onClose() } },
      ]
    }
    return [
      ...notes.filter((n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q) || n.tags.some((t) => t.toLowerCase().includes(q))).slice(0, 4).map((note): ResultItem => ({ kind: 'note', note })),
      ...events.filter((e) => e.title.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q)).slice(0, 3).map((event): ResultItem => ({ kind: 'event', event })),
      ...reminders.filter((r) => r.title.toLowerCase().includes(q)).slice(0, 3).map((reminder): ResultItem => ({ kind: 'reminder', reminder })),
    ]
  }, [query, notes, events, reminders, navigate, onClose, onNewNote, onNewReminder, onNewEvent])

  useEffect(() => { setActiveIndex(0) }, [results])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)) }
    if (e.key === 'Enter') { e.preventDefault(); selectItem(results[activeIndex]) }
    if (e.key === 'Escape') onClose()
  }

  function selectItem(item: ResultItem | undefined) {
    if (!item) return
    if (item.kind === 'note') { onSelectNote(item.note); onClose() }
    else if (item.kind === 'event') { onSelectEvent(item.event); onClose() }
    else if (item.kind === 'reminder') { navigate('/reminders'); onClose() }
    else if (item.kind === 'action') item.action()
  }

  return (
    <div
      className="absolute inset-0 z-50 flex items-start justify-center pt-[15vh] bg-primary/10 backdrop-blur-[2px] min-h-full"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-xl mx-4 bg-surface border border-border rounded-lg shadow-panel overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border-soft">
          <Search size={14} className="text-primary shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search or jump to..."
            className="flex-1 bg-transparent text-text-primary placeholder:text-text-tertiary text-sm focus:outline-none"
          />
          <kbd className="text-[10px] text-text-tertiary bg-panel px-1.5 py-0.5 rounded font-sans border border-border-soft">Esc</kbd>
        </div>

        <div className="max-h-80 overflow-y-auto py-1">
          {results.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-text-tertiary">No results</p>
          ) : (
            results.map((item, i) => (
              <button
                key={i}
                onClick={() => selectItem(item)}
                onMouseEnter={() => setActiveIndex(i)}
                className={['w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100', activeIndex === i ? 'bg-primary-light' : ''].join(' ')}
              >
                {item.kind === 'note' && <FileText size={13} className="text-primary shrink-0" />}
                {item.kind === 'event' && <CalendarDays size={13} className="text-primary shrink-0" />}
                {item.kind === 'reminder' && <Bell size={13} className="text-primary shrink-0" />}
                {item.kind === 'action' && <ArrowRight size={13} className="text-text-tertiary shrink-0" />}

                <div className="flex-1 min-w-0">
                  {item.kind === 'note' && (<><span className="text-sm text-text-primary block truncate">{item.note.title || 'Untitled'}</span>{item.note.body && <span className="text-[11px] text-text-tertiary block truncate">{item.note.body}</span>}</>)}
                  {item.kind === 'event' && (<><span className="text-sm text-text-primary block truncate">{item.event.title}</span><span className="text-[11px] text-text-tertiary">{format(item.event.start, 'MMM d, h:mm a')}</span></>)}
                  {item.kind === 'reminder' && (<><span className="text-sm text-text-primary block truncate">{item.reminder.title}</span><span className="text-[11px] text-text-tertiary">{format(item.reminder.dueAt, 'MMM d, h:mm a')}</span></>)}
                  {item.kind === 'action' && <span className="text-sm text-text-secondary">{item.label}</span>}
                </div>

                {item.kind === 'action' && item.shortcut && (
                  <kbd className="text-[10px] text-text-tertiary bg-panel px-1.5 py-0.5 rounded font-sans border border-border-soft">{item.shortcut}</kbd>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

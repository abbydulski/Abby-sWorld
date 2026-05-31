import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Topbar } from '../components/layout/Topbar'
import { NoteList } from '../components/notes/NoteList'
import { NoteEditor } from '../components/notes/NoteEditor'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { useNotes } from '../hooks/useNotes'
import { useManualEvents } from '../hooks/useManualEvents'
import { useGoogleCalendar } from '../hooks/useGoogleCalendar'
import type { Note } from '../types/note'
import type { UnifiedEvent } from '../types/event'

type Props = { token: string | null }

export function Notes({ token }: Props) {
  const { notes, create, update, remove, pin } = useNotes()
  const { events: manualEvents } = useManualEvents()
  const { data: googleEvents = [] } = useGoogleCalendar(token)

  const allEvents: UnifiedEvent[] = [
    ...googleEvents.map((e) => ({ ...e, linkedNoteIds: [] as string[] })),
    ...manualEvents,
  ]

  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [newNoteOpen, setNewNoteOpen] = useState(false)

  return (
    <div className="relative flex flex-col flex-1">
      <Topbar
        title="Notes"
        action={
          <Button onClick={() => setNewNoteOpen(true)}>
            <Plus size={14} />
            New note
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto">
        <NoteList
          notes={[...notes].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())}
          events={allEvents}
          onSelect={setSelectedNote}
          onPin={(id) => pin.mutate(id)}
        />
      </div>

      {selectedNote && (
        <Modal title="Edit note" onClose={() => setSelectedNote(null)}>
          <NoteEditor
            note={selectedNote}
            events={allEvents}
            onSave={(data) => update.mutate({ ...selectedNote, ...data })}
            onDelete={() => {
              remove.mutate(selectedNote.id)
              setSelectedNote(null)
            }}
            onClose={() => setSelectedNote(null)}
          />
        </Modal>
      )}

      {newNoteOpen && (
        <Modal title="New note" onClose={() => setNewNoteOpen(false)}>
          <NoteEditor
            events={allEvents}
            onSave={(data) => create.mutate(data)}
            onClose={() => setNewNoteOpen(false)}
          />
        </Modal>
      )}
    </div>
  )
}

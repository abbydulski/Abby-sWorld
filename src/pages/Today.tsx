import { useState } from 'react'
import { TodayView } from '../components/today/TodayView'
import { EventDetail } from '../components/events/EventDetail'
import { Modal } from '../components/ui/Modal'
import { NoteEditor } from '../components/notes/NoteEditor'
import { ReminderForm } from '../components/reminders/ReminderForm'
import { useGoogleCalendar } from '../hooks/useGoogleCalendar'
import { useManualEvents } from '../hooks/useManualEvents'
import { useNotes } from '../hooks/useNotes'
import { useStandaloneReminders } from '../hooks/useStandaloneReminders'
import { useGmailDigest } from '../hooks/useGmailDigest'
import { useEmailSummary } from '../hooks/useEmailSummary'
import type { UnifiedEvent } from '../types/event'
import type { Note } from '../types/note'
import type { StandaloneReminder } from '../types/standaloneReminder'

type Props = { token: string | null; onSignIn: () => void }

export function Today({ token, onSignIn }: Props) {
  const { data: googleEvents = [] } = useGoogleCalendar(token)
  const { events: manualEvents } = useManualEvents()
  const { notes, create: createNote, update: updateNote } = useNotes()
  const { reminders, create: createReminder, update: updateReminder, complete: completeReminder, remove: removeReminder } = useStandaloneReminders()
  const { data: threads = [] } = useGmailDigest(token)
  const { data: emailSummary, isLoading: emailLoading } = useEmailSummary(threads, !!token)

  const allEvents: UnifiedEvent[] = [
    ...googleEvents.map((e) => ({ ...e, linkedNoteIds: [] as string[] })),
    ...manualEvents,
  ]

  const [selectedEvent, setSelectedEvent] = useState<UnifiedEvent | null>(null)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [newNoteOpen, setNewNoteOpen] = useState(false)
  const [reminderFormOpen, setReminderFormOpen] = useState(false)
  const [editingReminder, setEditingReminder] = useState<StandaloneReminder | null>(null)

  function handleEditReminder(r: StandaloneReminder) {
    setEditingReminder(r)
    setReminderFormOpen(true)
  }

  return (
    <div className="relative flex-1">
      <TodayView
        events={allEvents}
        notes={notes}
        reminders={reminders}
        emailSummary={emailSummary}
        emailLoading={emailLoading}
        unreadCount={threads.length}
        isSignedIn={!!token}
        onSelectEvent={setSelectedEvent}
        onSelectNote={setSelectedNote}
        onCompleteReminder={(id) => completeReminder.mutate(id)}
        onDeleteReminder={(id) => removeReminder.mutate(id)}
        onEditReminder={handleEditReminder}
        onAddReminder={() => { setEditingReminder(null); setReminderFormOpen(true) }}
        onSignIn={onSignIn}
      />

      {selectedEvent && (
        <EventDetail
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onAddNote={() => { setSelectedEvent(null); setNewNoteOpen(true) }}
        />
      )}

      {selectedNote && (
        <Modal title="Edit note" onClose={() => setSelectedNote(null)}>
          <NoteEditor
            note={selectedNote}
            events={allEvents}
            onSave={(data) => updateNote.mutate({ ...selectedNote, ...data })}
            onClose={() => setSelectedNote(null)}
          />
        </Modal>
      )}

      {newNoteOpen && (
        <Modal title="New note" onClose={() => setNewNoteOpen(false)}>
          <NoteEditor
            events={allEvents}
            onSave={(data) => createNote.mutate(data)}
            onClose={() => setNewNoteOpen(false)}
          />
        </Modal>
      )}

      {reminderFormOpen && (
        <Modal
          title={editingReminder ? 'Edit reminder' : 'New reminder'}
          onClose={() => { setReminderFormOpen(false); setEditingReminder(null) }}
        >
          <ReminderForm
            reminder={editingReminder ?? undefined}
            onSave={(data) => {
              if (editingReminder) {
                updateReminder.mutate({ ...editingReminder, ...data })
              } else {
                createReminder.mutate(data)
              }
            }}
            onClose={() => { setReminderFormOpen(false); setEditingReminder(null) }}
          />
        </Modal>
      )}
    </div>
  )
}

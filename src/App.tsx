import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Layout } from './components/layout/Layout'
import { Today } from './pages/Today'
import { Events } from './pages/Events'
import { Notes } from './pages/Notes'
import { Reminders } from './pages/Reminders'
import { Settings } from './pages/Settings'
import { CommandPalette } from './components/CommandPalette'
import { Modal } from './components/ui/Modal'
import { NoteEditor } from './components/notes/NoteEditor'
import { ReminderForm } from './components/reminders/ReminderForm'
import { EventForm } from './components/events/EventForm'
import { useGoogleAuth } from './hooks/useGoogleAuth'
import { useNotes } from './hooks/useNotes'
import { useManualEvents } from './hooks/useManualEvents'
import { useGoogleCalendar } from './hooks/useGoogleCalendar'
import { useStandaloneReminders } from './hooks/useStandaloneReminders'
import type { UnifiedEvent } from './types/event'
import type { Note } from './types/note'

const queryClient = new QueryClient()

function AppRoutes() {
  const { token, userInfo, signIn, signOut, silentLoading } = useGoogleAuth()

  if (silentLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-5 h-0.5 bg-primary animate-pulse" />
          <span className="text-xs text-text-tertiary font-mono">signing in...</span>
        </div>
      </div>
    )
  }
  const { notes, create: createNote } = useNotes()
  const { events: manualEvents } = useManualEvents()
  const { data: googleEvents = [] } = useGoogleCalendar(token)
  const { reminders, create: createReminder } = useStandaloneReminders()

  const allEvents: UnifiedEvent[] = [
    ...googleEvents.map((e) => ({ ...e, linkedNoteIds: [] as string[] })),
    ...manualEvents,
  ]

  const [paletteOpen, setPaletteOpen] = useState(false)
  const [newNoteOpen, setNewNoteOpen] = useState(false)
  const [newReminderOpen, setNewReminderOpen] = useState(false)
  const [newEventOpen, setNewEventOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<UnifiedEvent | null>(null)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className="relative">
      <Routes>
        <Route element={<Layout userPicture={userInfo?.picture} userName={userInfo?.name} onOpenSearch={() => setPaletteOpen(true)} />}>
          <Route index element={<Today token={token} onSignIn={signIn} />} />
          <Route path="events" element={<Events token={token} />} />
          <Route path="notes" element={<Notes token={token} />} />
          <Route path="reminders" element={<Reminders />} />
          <Route path="settings" element={<Settings token={token} userInfo={userInfo} onSignIn={signIn} onSignOut={signOut} />} />
        </Route>
      </Routes>

      {paletteOpen && (
        <div className="absolute inset-0 z-50">
          <CommandPalette
            notes={notes}
            events={allEvents}
            reminders={reminders}
            onClose={() => setPaletteOpen(false)}
            onNewNote={() => { setPaletteOpen(false); setNewNoteOpen(true) }}
            onNewReminder={() => { setPaletteOpen(false); setNewReminderOpen(true) }}
            onNewEvent={() => { setPaletteOpen(false); setNewEventOpen(true) }}
            onSelectNote={(note) => { setPaletteOpen(false); setSelectedNote(note) }}
            onSelectEvent={(event) => { setPaletteOpen(false); setSelectedEvent(event) }}
          />
        </div>
      )}

      {newNoteOpen && (
        <div className="absolute inset-0 z-50">
          <Modal title="New note" onClose={() => setNewNoteOpen(false)}>
            <NoteEditor events={allEvents} onSave={(data) => createNote.mutate(data)} onClose={() => setNewNoteOpen(false)} />
          </Modal>
        </div>
      )}

      {newReminderOpen && (
        <div className="absolute inset-0 z-50">
          <Modal title="New reminder" onClose={() => setNewReminderOpen(false)}>
            <ReminderForm onSave={(data) => createReminder.mutate(data)} onClose={() => setNewReminderOpen(false)} />
          </Modal>
        </div>
      )}

      {newEventOpen && (
        <div className="absolute inset-0 z-50">
          <Modal title="New event" onClose={() => setNewEventOpen(false)}>
            <EventForm onClose={() => setNewEventOpen(false)} />
          </Modal>
        </div>
      )}
    </div>
  )
}

export function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename="/Abby-sWorld">
          <AppRoutes />
        </BrowserRouter>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  )
}

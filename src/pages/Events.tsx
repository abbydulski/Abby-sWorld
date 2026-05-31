import { useState } from 'react'
import { Plus, List, CalendarDays } from 'lucide-react'
import { Topbar } from '../components/layout/Topbar'
import { EventList } from '../components/events/EventList'
import { EventDetail } from '../components/events/EventDetail'
import { EventForm } from '../components/events/EventForm'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { useGoogleCalendar } from '../hooks/useGoogleCalendar'
import { useManualEvents } from '../hooks/useManualEvents'
import { Spinner } from '../components/ui/Spinner'
import type { UnifiedEvent } from '../types/event'

type Props = { token: string | null }

export function Events({ token }: Props) {
  const { data: googleEvents = [], isLoading } = useGoogleCalendar(token)
  const { events: manualEvents } = useManualEvents()

  const allEvents: UnifiedEvent[] = [
    ...googleEvents.map((e) => ({ ...e, linkedNoteIds: [] as string[] })),
    ...manualEvents,
  ].sort((a, b) => a.start.getTime() - b.start.getTime())

  const [selectedEvent, setSelectedEvent] = useState<UnifiedEvent | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  return (
    <div className="relative flex flex-col flex-1">
      <Topbar
        title="Events"
        action={
          <Button onClick={() => setFormOpen(true)}>
            <Plus size={14} />
            New event
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : (
          <EventList events={allEvents} onSelect={setSelectedEvent} />
        )}
      </div>

      {selectedEvent && (
        <EventDetail
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onAddNote={() => {}}
        />
      )}

      {formOpen && (
        <Modal title="New event" onClose={() => setFormOpen(false)}>
          <EventForm onClose={() => setFormOpen(false)} />
        </Modal>
      )}
    </div>
  )
}

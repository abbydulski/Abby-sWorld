import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Topbar } from '../components/layout/Topbar'
import { ReminderItem } from '../components/reminders/ReminderItem'
import { ReminderForm } from '../components/reminders/ReminderForm'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { Bell } from 'lucide-react'
import { useStandaloneReminders } from '../hooks/useStandaloneReminders'
import { isPast, isToday, isFuture } from 'date-fns'
import type { StandaloneReminder } from '../types/standaloneReminder'

export function Reminders() {
  const { reminders, create, update, complete, remove } = useStandaloneReminders()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<StandaloneReminder | null>(null)

  const due = reminders.filter((r) => !r.completed && (isToday(r.dueAt) || isPast(r.dueAt)))
  const upcoming = reminders.filter((r) => !r.completed && isFuture(r.dueAt) && !isToday(r.dueAt))
  const completed = reminders.filter((r) => r.completed)

  function openEdit(r: StandaloneReminder) {
    setEditing(r)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditing(null)
  }

  return (
    <div className="relative flex flex-col flex-1">
      <Topbar
        title="Reminders"
        action={
          <Button onClick={() => { setEditing(null); setFormOpen(true) }}>
            <Plus size={14} />
            New reminder
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-8 max-w-2xl">
        {reminders.length === 0 ? (
          <EmptyState icon={Bell} message="No reminders yet" action={
            <Button variant="subtle" onClick={() => setFormOpen(true)}>
              <Plus size={14} />
              Add one
            </Button>
          } />
        ) : (
          <>
            {due.length > 0 && (
              <section>
                <h2 className="text-[11px] font-medium text-text-secondary uppercase tracking-widest mb-3">
                  Due
                </h2>
                <div className="bg-surface rounded-lg shadow-card overflow-hidden divide-y divide-border-soft">
                  {due.map((r) => (
                    <ReminderItem
                      key={r.id}
                      reminder={r}
                      onComplete={() => complete.mutate(r.id)}
                      onDelete={() => remove.mutate(r.id)}
                      onEdit={() => openEdit(r)}
                    />
                  ))}
                </div>
              </section>
            )}

            {upcoming.length > 0 && (
              <section>
                <h2 className="text-[11px] font-medium text-text-secondary uppercase tracking-widest mb-3">
                  Upcoming
                </h2>
                <div className="bg-surface rounded-lg shadow-card overflow-hidden divide-y divide-border-soft">
                  {upcoming.map((r) => (
                    <ReminderItem
                      key={r.id}
                      reminder={r}
                      onComplete={() => complete.mutate(r.id)}
                      onDelete={() => remove.mutate(r.id)}
                      onEdit={() => openEdit(r)}
                    />
                  ))}
                </div>
              </section>
            )}

            {completed.length > 0 && (
              <section>
                <h2 className="text-[11px] font-medium text-text-secondary uppercase tracking-widest mb-3">
                  Completed
                </h2>
                <div className="bg-surface rounded-lg shadow-card overflow-hidden divide-y divide-border-soft opacity-60">
                  {completed.map((r) => (
                    <ReminderItem
                      key={r.id}
                      reminder={r}
                      onComplete={() => complete.mutate(r.id)}
                      onDelete={() => remove.mutate(r.id)}
                      onEdit={() => openEdit(r)}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {formOpen && (
        <Modal title={editing ? 'Edit reminder' : 'New reminder'} onClose={closeForm}>
          <ReminderForm
            reminder={editing ?? undefined}
            onSave={(data) => {
              if (editing) update.mutate({ ...editing, ...data })
              else create.mutate(data)
            }}
            onClose={closeForm}
          />
        </Modal>
      )}
    </div>
  )
}

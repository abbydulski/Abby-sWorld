import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { subMinutes } from 'date-fns'
import { db } from '../lib/db'
import { generateId } from '../lib/utils'
import { scheduleReminder } from '../lib/pushNotifications'
import type { Reminder } from '../types/reminder'
import type { UnifiedEvent } from '../types/event'

async function getAllReminders(): Promise<Reminder[]> {
  const store = await db
  return store.getAll('reminders')
}

export function useReminders() {
  const qc = useQueryClient()

  const { data: reminders = [] } = useQuery({
    queryKey: ['reminders'],
    queryFn: getAllReminders,
  })

  const create = useMutation({
    mutationFn: async ({ event, offsetMinutes }: { event: UnifiedEvent; offsetMinutes: number }) => {
      const reminder: Reminder = {
        id: generateId(),
        eventId: event.id,
        offsetMinutes,
        fireAt: subMinutes(event.start, offsetMinutes),
        fired: false,
      }
      const store = await db
      await store.put('reminders', reminder)
      scheduleReminder(reminder, event)
      return reminder
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reminders'] }),
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const store = await db
      await store.delete('reminders', id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reminders'] }),
  })

  const markFired = useMutation({
    mutationFn: async (id: string) => {
      const store = await db
      const reminder = await store.get('reminders', id)
      if (reminder) await store.put('reminders', { ...reminder, fired: true })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reminders'] }),
  })

  return { reminders, create, remove, markFired }
}

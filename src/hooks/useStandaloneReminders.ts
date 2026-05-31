import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { addDays, addWeeks, addMonths } from 'date-fns'
import { db } from '../lib/db'
import { generateId } from '../lib/utils'
import type { StandaloneReminder, RecurrenceType } from '../types/standaloneReminder'

async function getAll(): Promise<StandaloneReminder[]> {
  return (await db).getAll('standalone_reminders')
}

function nextDueAt(dueAt: Date, recurrence: RecurrenceType): Date {
  if (recurrence === 'daily') return addDays(dueAt, 1)
  if (recurrence === 'weekly') return addWeeks(dueAt, 1)
  if (recurrence === 'monthly') return addMonths(dueAt, 1)
  return dueAt
}

export function useStandaloneReminders() {
  const qc = useQueryClient()
  const key = ['standalone_reminders']

  const { data: reminders = [] } = useQuery({ queryKey: key, queryFn: getAll })

  const create = useMutation({
    mutationFn: async (partial: Omit<StandaloneReminder, 'id' | 'completed'>) => {
      const reminder: StandaloneReminder = { ...partial, id: generateId(), completed: false }
      await (await db).put('standalone_reminders', reminder)
      return reminder
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  })

  const update = useMutation({
    mutationFn: async (reminder: StandaloneReminder) => {
      await (await db).put('standalone_reminders', reminder)
      return reminder
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  })

  const complete = useMutation({
    mutationFn: async (id: string) => {
      const store = await db
      const r = await store.get('standalone_reminders', id)
      if (!r) return
      if (r.recurrence !== 'none') {
        // advance instead of deleting
        await store.put('standalone_reminders', {
          ...r,
          dueAt: nextDueAt(r.dueAt, r.recurrence),
          completed: false,
        })
      } else {
        await store.put('standalone_reminders', { ...r, completed: true })
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await (await db).delete('standalone_reminders', id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: key }),
  })

  return { reminders, create, update, complete, remove }
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '../lib/db'
import { generateId } from '../lib/utils'
import type { UnifiedEvent } from '../types/event'

async function getAllManualEvents(): Promise<UnifiedEvent[]> {
  const store = await db
  return store.getAll('manual_events')
}

export function useManualEvents() {
  const qc = useQueryClient()

  const { data: events = [] } = useQuery({
    queryKey: ['manual_events'],
    queryFn: getAllManualEvents,
  })

  const create = useMutation({
    mutationFn: async (partial: Omit<UnifiedEvent, 'id' | 'source'>) => {
      const event: UnifiedEvent = { ...partial, id: generateId(), source: 'manual' }
      const store = await db
      await store.put('manual_events', event)
      return event
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['manual_events'] }),
  })

  const update = useMutation({
    mutationFn: async (event: UnifiedEvent) => {
      const store = await db
      await store.put('manual_events', event)
      return event
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['manual_events'] }),
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const store = await db
      await store.delete('manual_events', id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['manual_events'] }),
  })

  return { events, create, update, remove }
}

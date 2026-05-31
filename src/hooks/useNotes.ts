import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '../lib/db'
import { generateId } from '../lib/utils'
import type { Note } from '../types/note'

async function getAllNotes(): Promise<Note[]> {
  const store = await db
  return store.getAll('notes')
}

export function useNotes() {
  const qc = useQueryClient()

  const { data: notes = [] } = useQuery({
    queryKey: ['notes'],
    queryFn: getAllNotes,
  })

  const create = useMutation({
    mutationFn: async (partial: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
      const note: Note = {
        ...partial,
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const store = await db
      await store.put('notes', note)
      return note
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  })

  const update = useMutation({
    mutationFn: async (note: Note) => {
      const updated = { ...note, updatedAt: new Date() }
      const store = await db
      await store.put('notes', updated)
      return updated
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const store = await db
      await store.delete('notes', id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  })

  const pin = useMutation({
    mutationFn: async (id: string) => {
      const store = await db
      const note = await store.get('notes', id)
      if (note) await store.put('notes', { ...note, pinned: !note.pinned })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  })

  return { notes, create, update, remove, pin }
}

import { openDB, type DBSchema } from 'idb'
import type { Note } from '../types/note'
import type { Reminder } from '../types/reminder'
import type { UnifiedEvent } from '../types/event'
import type { StandaloneReminder } from '../types/standaloneReminder'

interface AppDB extends DBSchema {
  notes: {
    key: string
    value: Note
    indexes: { by_updated: Date }
  }
  reminders: {
    key: string
    value: Reminder
    indexes: { by_event: string; by_fire_at: Date }
  }
  manual_events: {
    key: string
    value: UnifiedEvent
    indexes: { by_start: Date }
  }
  standalone_reminders: {
    key: string
    value: StandaloneReminder
    indexes: { by_due: Date }
  }
}

const DB_NAME = 'abbysworld'
const DB_VERSION = 2

export const db = openDB<AppDB>(DB_NAME, DB_VERSION, {
  upgrade(db, oldVersion) {
    if (oldVersion < 1) {
      const notesStore = db.createObjectStore('notes', { keyPath: 'id' })
      notesStore.createIndex('by_updated', 'updatedAt')

      const remindersStore = db.createObjectStore('reminders', { keyPath: 'id' })
      remindersStore.createIndex('by_event', 'eventId')
      remindersStore.createIndex('by_fire_at', 'fireAt')

      const eventsStore = db.createObjectStore('manual_events', { keyPath: 'id' })
      eventsStore.createIndex('by_start', 'start')
    }

    if (oldVersion < 2) {
      const srStore = db.createObjectStore('standalone_reminders', { keyPath: 'id' })
      srStore.createIndex('by_due', 'dueAt')
    }
  },
})

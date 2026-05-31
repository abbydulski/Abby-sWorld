import type { Reminder } from './reminder'

export type CalendarEvent = {
  id: string
  source: 'google'
  title: string
  description?: string
  start: Date
  end: Date
  allDay: boolean
  color?: string
}

export type ManualEvent = {
  id: string
  source: 'manual'
  title: string
  description?: string
  start: Date
  end: Date
  allDay: boolean
  color?: string
}

export type UnifiedEvent = (CalendarEvent | ManualEvent) & {
  reminder?: Reminder
  linkedNoteIds: string[]
}
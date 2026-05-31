export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly'

export type StandaloneReminder = {
  id: string
  title: string
  notes?: string
  dueAt: Date
  recurrence: RecurrenceType
  completed: boolean
}

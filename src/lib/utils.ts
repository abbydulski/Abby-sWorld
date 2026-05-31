import { format, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'
import type { UnifiedEvent } from '../types/event'

export function formatDate(date: Date): string {
  return format(date, 'EEEE, MMMM d')
}

export function formatTime(date: Date): string {
  return format(date, 'h:mm a')
}

export function formatShortDate(date: Date): string {
  return format(date, 'MMM d')
}

export function groupByDate(events: UnifiedEvent[]): Map<string, UnifiedEvent[]> {
  const map = new Map<string, UnifiedEvent[]>()
  for (const event of events) {
    const key = format(event.start, 'yyyy-MM-dd')
    const group = map.get(key) ?? []
    group.push(event)
    map.set(key, group)
  }
  return map
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength).trimEnd() + '...'
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}

export function getWeekDays(date: Date): Date[] {
  return eachDayOfInterval({
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 }),
  })
}

export function generateId(): string {
  return crypto.randomUUID()
}
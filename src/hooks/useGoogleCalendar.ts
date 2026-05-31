import { useQuery } from '@tanstack/react-query'
import { addMonths, subMonths } from 'date-fns'
import { fetchCalendarEvents } from '../lib/googleApi'
import type { CalendarEvent } from '../types/event'

export function useGoogleCalendar(token: string | null) {
  return useQuery<CalendarEvent[]>({
    queryKey: ['calendar', token],
    enabled: !!token,
    queryFn: () =>
      fetchCalendarEvents(token!, subMonths(new Date(), 1), addMonths(new Date(), 3)),
    staleTime: 5 * 60 * 1000,
  })
}

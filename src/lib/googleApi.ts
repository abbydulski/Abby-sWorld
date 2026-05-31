import type { CalendarEvent } from '../types/event'

const CALENDAR_BASE = 'https://www.googleapis.com/calendar/v3'
const GMAIL_BASE = 'https://www.googleapis.com/gmail/v1'

async function apiFetch<T>(url: string, token: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(`Google API error: ${res.status}`)
  return res.json()
}

export async function fetchCalendarEvents(
  token: string,
  timeMin: Date,
  timeMax: Date,
): Promise<CalendarEvent[]> {
  const params = new URLSearchParams({
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: 'true',
    orderBy: 'startTime',
    maxResults: '250',
  })
  const data = await apiFetch<{ items: GCalItem[] }>(
    `${CALENDAR_BASE}/calendars/primary/events?${params}`,
    token,
  )
  return (data.items ?? []).map(normalizeCalendarEvent)
}

type GCalItem = {
  id: string
  summary?: string
  description?: string
  start: { dateTime?: string; date?: string }
  end: { dateTime?: string; date?: string }
  colorId?: string
}

function normalizeCalendarEvent(item: GCalItem): CalendarEvent {
  const allDay = !item.start.dateTime
  const start = new Date(item.start.dateTime ?? item.start.date ?? '')
  const end = new Date(item.end.dateTime ?? item.end.date ?? '')
  return {
    id: item.id,
    source: 'google',
    title: item.summary ?? '(No title)',
    description: item.description,
    start,
    end,
    allDay,
    color: item.colorId,
  }
}

export type GmailThread = {
  id: string
  snippet: string
  subject: string
  from: string
  date: Date
}

export async function fetchGmailThreads(token: string, maxResults = 10): Promise<GmailThread[]> {
  const data = await apiFetch<{ threads?: { id: string }[] }>(
    `${GMAIL_BASE}/users/me/threads?labelIds=INBOX&labelIds=UNREAD&maxResults=${maxResults}`,
    token,
  )
  if (!data.threads?.length) return []

  const threads = await Promise.all(
    data.threads.map(({ id }) =>
      apiFetch<GThreadData>(`${GMAIL_BASE}/users/me/threads/${id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`, token),
    ),
  )
  return threads.map(normalizeThread)
}

type GThreadData = {
  id: string
  snippet: string
  messages: { payload: { headers: { name: string; value: string }[] } }[]
}

function normalizeThread(t: GThreadData): GmailThread {
  const headers = t.messages[0]?.payload?.headers ?? []
  const get = (name: string) => headers.find(h => h.name === name)?.value ?? ''
  return {
    id: t.id,
    snippet: t.snippet,
    subject: get('Subject'),
    from: get('From'),
    date: new Date(get('Date')),
  }
}

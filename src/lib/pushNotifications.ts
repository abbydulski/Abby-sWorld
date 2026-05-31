import type { Reminder } from '../types/reminder'
import type { UnifiedEvent } from '../types/event'

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  const result = await Notification.requestPermission()
  return result === 'granted'
}

export function scheduleReminder(reminder: Reminder, event: UnifiedEvent): void {
  const msUntilFire = reminder.fireAt.getTime() - Date.now()
  if (msUntilFire <= 0) return

  setTimeout(() => {
    if (Notification.permission !== 'granted') return
    new Notification(event.title, {
      body: `Starting in ${reminder.offsetMinutes} minute${reminder.offsetMinutes !== 1 ? 's' : ''}`,
      tag: reminder.id,
    })
  }, msUntilFire)
}

export function cancelReminder(_reminderId: string): void {
  // Browser Notification API doesn't allow cancelling scheduled notifications by tag.
  // Reminders are filtered by `fired` flag in the service worker poll loop.
}

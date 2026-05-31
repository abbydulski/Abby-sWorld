export type Reminder = {
  id: string
  eventId: string
  offsetMinutes: number
  fireAt: Date
  fired: boolean
}

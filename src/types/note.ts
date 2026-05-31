export type NoteTag = string

export type Note = {
  id: string
  title: string
  body: string
  tags: NoteTag[]
  linkedEventId?: string
  pinned?: boolean
  createdAt: Date
  updatedAt: Date
}

# AbbyWorld — Project Specification

## Overview

AbbyWorld is a personal productivity PWA (Progressive Web App) for one user. It surfaces Google Calendar events (with per-event browser push reminders) and freeform notes that can optionally be linked to events. There is no backend — everything runs in the browser. The app is hosted on GitHub Pages.

---

## Design System

### Palette
- **Primary blue:** `#1A56DB` (actions, active states, links)
- **Light blue:** `#EBF2FF` (backgrounds, hover fills, badges)
- **Accent yellow:** `#F5C400` (highlights, reminder badge dot, active indicators)
- **Light yellow:** `#FFFBEB` (subtle warm surfaces)
- **Surface white:** `#FFFFFF`
- **Background:** `#F7F8FA`
- **Border:** `#E4E7EC` (all dividers and card outlines)
- **Text primary:** `#101828`
- **Text secondary:** `#667085`
- **Text tertiary:** `#98A2B3`

### Typography
- Font: **Inter** (Google Fonts)
- Base: 14px / line-height 1.6
- Headings: weight 500 only — never 600 or 700
- Labels and meta: 11–12px, `#667085`

### UI Rules
- No emojis anywhere in the UI
- No gradients, no drop shadows (except a single `0 1px 3px rgba(0,0,0,0.06)` on cards)
- No rounded corners larger than `10px`
- Flat, minimal components — borders over shadows
- All interactive elements have a clear hover state (light blue fill `#EBF2FF`)
- Active/selected state: `#1A56DB` text + `#EBF2FF` background
- Yellow (`#F5C400`) is used sparingly — only for reminder indicators and one or two accent moments
- Icons: Lucide React (`lucide-react`) — outline style only, 16px default

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Routing | React Router v6 |
| Styling | Tailwind CSS v3 (JIT) |
| Data fetching | TanStack Query v5 |
| Local storage | `idb` (IndexedDB wrapper) |
| Auth | `@react-oauth/google` |
| Google APIs | Google Calendar API v3, Gmail API v1 (REST, browser-side) |
| PWA | `vite-plugin-pwa` (Workbox) |
| Push notifications | Web Push API + service worker |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |

---

## Project Structure

```
abbysworld/
├── public/
│   ├── manifest.json
│   └── icons/                   # PWA icons: 192x192, 512x512 (simple blue "A" on white)
├── src/
│   ├── main.tsx
│   ├── App.tsx                  # Router setup, QueryClientProvider, GoogleOAuthProvider
│   ├── env.d.ts
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx      # Left nav: logo, nav links, user avatar
│   │   │   ├── Topbar.tsx       # Page title + primary action button
│   │   │   └── Layout.tsx       # Sidebar + main content shell
│   │   ├── ui/
│   │   │   ├── Button.tsx       # variant: primary | ghost | subtle
│   │   │   ├── Badge.tsx        # color: blue | yellow | gray
│   │   │   ├── Card.tsx         # thin border, 8px radius, white bg
│   │   │   ├── Input.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Modal.tsx        # centered overlay, no position:fixed abuse
│   │   │   ├── EmptyState.tsx   # centered icon + message for empty views
│   │   │   └── Spinner.tsx
│   │   ├── events/
│   │   │   ├── EventList.tsx    # Grouped by date
│   │   │   ├── EventCard.tsx    # Single event row/card
│   │   │   ├── EventDetail.tsx  # Slide-in panel or modal
│   │   │   ├── EventForm.tsx    # Create/edit manual event
│   │   │   └── ReminderPicker.tsx  # "Remind me X before" selector
│   │   ├── notes/
│   │   │   ├── NoteList.tsx
│   │   │   ├── NoteCard.tsx
│   │   │   └── NoteEditor.tsx   # Simple textarea editor with tag + event-link fields
│   │   └── today/
│   │       └── TodayView.tsx    # Dashboard: today's events + due reminders + recent notes
│   │
│   ├── pages/
│   │   ├── Today.tsx
│   │   ├── Events.tsx
│   │   ├── Notes.tsx
│   │   └── Settings.tsx
│   │
│   ├── hooks/
│   │   ├── useGoogleCalendar.ts   # Fetches events from Google Calendar API
│   │   ├── useGoogleAuth.ts       # Wraps @react-oauth/google, exposes token + signIn/Out
│   │   ├── useNotes.ts            # CRUD for notes in IndexedDB
│   │   ├── useReminders.ts        # CRUD for reminders in IndexedDB, schedules push
│   │   └── useGmailDigest.ts      # Fetches recent unread thread summaries
│   │
│   ├── lib/
│   │   ├── db.ts                  # idb schema: notes table, reminders table
│   │   ├── googleApi.ts           # Thin fetch wrappers for Calendar + Gmail REST APIs
│   │   ├── pushNotifications.ts   # requestPermission, scheduleReminder, cancelReminder
│   │   └── utils.ts               # formatDate, groupByDate, truncate, etc.
│   │
│   ├── types/
│   │   ├── event.ts               # CalendarEvent, ManualEvent, UnifiedEvent
│   │   ├── note.ts                # Note, NoteTag
│   │   └── reminder.ts            # Reminder (linked to eventId)
│   │
│   └── service-worker/
│       └── sw.ts                  # Workbox config + push event handler
│
├── .env.example                   # VITE_GOOGLE_CLIENT_ID=
├── .github/
│   └── workflows/
│       └── deploy.yml             # Build + deploy to gh-pages branch on push to main
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Data Models

### `UnifiedEvent`
Merges Google Calendar events and manually created events into one shape.
```ts
type UnifiedEvent = {
  id: string
  source: 'google' | 'manual'
  title: string
  description?: string
  start: Date
  end: Date
  allDay: boolean
  reminder?: Reminder        // null if no reminder set
  linkedNoteIds: string[]
  color?: string             // optional override for calendar dot color
}
```

### `Reminder`
Stored in IndexedDB. The service worker reads these to fire push notifications.
```ts
type Reminder = {
  id: string
  eventId: string
  offsetMinutes: number      // e.g. 30 = "notify 30 min before"
  fireAt: Date               // computed: event.start - offsetMinutes
  fired: boolean
}
```

### `Note`
```ts
type Note = {
  id: string
  title: string
  body: string               // plain text (no markdown rendering needed unless desired)
  tags: string[]
  linkedEventId?: string     // optional link to a UnifiedEvent
  createdAt: Date
  updatedAt: Date
}
```

---

## Views

### Today (default route `/`)
- Greeting: "Monday, May 31" — no salutation text
- Three stat chips: events today / reminders firing today / unread emails
- Section: Today's events (from Google Calendar + manual), sorted by time
- Section: Notes updated today or pinned
- No separate "reminders" section — reminders show as a yellow dot on their event

### Events (`/events`)
- Default view: week view (Mon–Sun), switching to list view is a toggle
- Each event card shows: time, title, reminder dot (yellow) if a reminder is set
- Clicking an event opens `EventDetail` panel (slide in from right or modal)
- `EventDetail` includes: title, time, description, reminder picker, linked notes, "Add note" shortcut
- Floating "+" button opens `EventForm` to create a manual event

### Notes (`/notes`)
- Masonry or single-column list of `NoteCard` components
- Each card: title, body preview (2 lines), tags as small pills, linked event badge if present
- Clicking opens `NoteEditor` (full-page or modal)
- `NoteEditor`: title input, body textarea, tag input (comma-separated), event link dropdown (searches upcoming events)
- Floating "+" button creates a new blank note

### Settings (`/settings`)
- Google account connection status + "Sign out" button
- Notification permission toggle (requests browser push permission)
- Sync frequency selector (every 5 / 15 / 30 minutes)
- "Clear all local data" danger button (user must confirm)

---

## Google OAuth Setup

The user will need to:
1. Create a project in Google Cloud Console
2. Enable Google Calendar API and Gmail API
3. Create OAuth 2.0 credentials (Web application type)
4. Add `https://<username>.github.io` as an authorized JavaScript origin
5. Copy the Client ID into `.env` as `VITE_GOOGLE_CLIENT_ID`

The app requests these scopes:
- `https://www.googleapis.com/auth/calendar.readonly`
- `https://www.googleapis.com/auth/gmail.readonly`

Token is stored in memory only (not localStorage) for security. On refresh, the user re-auths silently via Google's `prompt: 'none'` flow if still within the session window.

---

## Push Notifications

- On first load, `pushNotifications.ts` calls `Notification.requestPermission()`
- When a reminder is saved (in `useReminders`), `scheduleReminder()` computes `fireAt` and stores it in IndexedDB
- The service worker polls IndexedDB on a `setInterval` (every 60 seconds) while active, and fires `self.registration.showNotification()` for any reminder where `fireAt <= now && !fired`
- Notification payload: `{ title: event.title, body: "Starting in X minutes", tag: reminder.id }`
- After firing, the reminder is marked `fired: true`

---

## GitHub Actions Deploy

`.github/workflows/deploy.yml` should:
1. Trigger on push to `main`
2. Run `npm ci`
3. Run `npm run build` (outputs to `dist/`)
4. Deploy `dist/` to the `gh-pages` branch using `peaceiris/actions-gh-pages`

`vite.config.ts` must set `base: '/abbysworld/'` (or whatever the repo name is).

---

## Notes for Claude Code

- Keep components small and single-responsibility
- All colors come from the design palette above — do not use Tailwind's default color classes (configure the palette in `tailwind.config.ts` under `extend.colors`)
- The app is single-user — no auth guards, no multi-user concerns
- Google Calendar data is read-only; manual events are stored in IndexedDB alongside notes
- Prefer `date-fns` for all date formatting and math
- No animation libraries — transitions are CSS only (`transition: background 0.15s ease`)
- The sidebar is always visible on desktop; collapses to a bottom nav bar on mobile (< 768px)
- All modals/panels must work without `position: fixed` (use in-flow overlay wrappers with `min-height`)

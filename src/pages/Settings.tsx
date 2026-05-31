import { useState } from 'react'
import { Topbar } from '../components/layout/Topbar'
import { Button } from '../components/ui/Button'
import { requestNotificationPermission } from '../lib/pushNotifications'
import { db } from '../lib/db'

type Props = {
  token: string | null
  userInfo: { name: string; email: string; picture: string } | null
  onSignIn: () => void
  onSignOut: () => void
}

const SYNC_OPTIONS = [5, 15, 30]

export function Settings({ token, userInfo, onSignIn, onSignOut }: Props) {
  const [notifGranted, setNotifGranted] = useState(
    typeof Notification !== 'undefined' ? Notification.permission === 'granted' : false,
  )
  const [syncMinutes, setSyncMinutes] = useState(15)
  const [clearConfirm, setClearConfirm] = useState(false)

  async function handleRequestNotifications() {
    const granted = await requestNotificationPermission()
    setNotifGranted(granted)
  }

  async function handleClearData() {
    if (!clearConfirm) {
      setClearConfirm(true)
      return
    }
    const store = await db
    await store.clear('notes')
    await store.clear('reminders')
    await store.clear('manual_events')
    setClearConfirm(false)
  }

  return (
    <div className="flex flex-col flex-1">
      <Topbar title="Settings" />

      <div className="px-6 py-6 flex flex-col gap-8 max-w-md">
        <section className="flex flex-col gap-3">
          <h2 className="text-[11px] font-medium text-text-secondary uppercase tracking-wide">
            Google account
          </h2>
          {userInfo ? (
            <div className="flex items-center justify-between p-3 border border-border rounded">
              <div className="flex items-center gap-2.5">
                <img src={userInfo.picture} alt={userInfo.name} className="w-7 h-7 rounded-full" />
                <div className="flex flex-col">
                  <span className="text-sm text-text-primary">{userInfo.name}</span>
                  <span className="text-[12px] text-text-secondary">{userInfo.email}</span>
                </div>
              </div>
              <Button variant="ghost" onClick={onSignOut}>
                Sign out
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 border border-border rounded">
              <span className="text-sm text-text-secondary">Not connected</span>
              <Button onClick={onSignIn}>Connect Google</Button>
            </div>
          )}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-[11px] font-medium text-text-secondary uppercase tracking-wide">
            Notifications
          </h2>
          <div className="flex items-center justify-between p-3 border border-border rounded">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm text-text-primary">Push notifications</span>
              <span className="text-[12px] text-text-secondary">
                {notifGranted ? 'Enabled' : 'Not enabled'}
              </span>
            </div>
            {!notifGranted && (
              <Button variant="subtle" onClick={handleRequestNotifications}>
                Enable
              </Button>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-[11px] font-medium text-text-secondary uppercase tracking-wide">
            Sync frequency
          </h2>
          <div className="flex gap-2">
            {SYNC_OPTIONS.map((min) => (
              <button
                key={min}
                onClick={() => setSyncMinutes(min)}
                className={[
                  'px-3 py-1.5 rounded border text-sm transition-colors duration-150',
                  syncMinutes === min
                    ? 'border-primary bg-primary-light text-primary'
                    : 'border-border text-text-secondary hover:bg-primary-light hover:text-primary',
                ].join(' ')}
              >
                {min}m
              </button>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-[11px] font-medium text-text-secondary uppercase tracking-wide">
            Data
          </h2>
          <div className="flex items-center justify-between p-3 border border-red-200 rounded">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm text-text-primary">Clear all local data</span>
              <span className="text-[12px] text-text-secondary">
                Deletes all notes, reminders, and manual events
              </span>
            </div>
            <Button
              variant="ghost"
              onClick={handleClearData}
              className={clearConfirm ? 'text-red-600 hover:bg-red-50' : ''}
            >
              {clearConfirm ? 'Confirm' : 'Clear'}
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

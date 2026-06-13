'use client'

import { useEffect, useRef } from 'react'

/** Calls server sync once per session so the Supabase profile stays linked to Clerk. */
export function SyncCustomerOnVisit() {
  const synced = useRef(false)

  useEffect(() => {
    if (synced.current) return
    synced.current = true
    fetch('/api/customer/sync', { method: 'POST' }).catch(() => {
      synced.current = false
    })
  }, [])

  return null
}

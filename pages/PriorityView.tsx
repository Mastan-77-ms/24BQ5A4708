import React, { useEffect, useMemo, useState } from 'react'
import { Box, Typography } from '@mui/material'
import NotificationList from '../NotificationList'

type NotificationRaw = { ID: string; Type: string; Message: string; Timestamp: string }

const API_BASE = import.meta.env.VITE_NOTIF_URL || 'http://4.224.186.213/evaluation-service/notifications'
const TOKEN = (import.meta.env as any).VITE_LOG_TOKEN || ''
const TYPE_WEIGHT: Record<string, number> = { Placement: 3, Result: 2, Event: 1 }

export default function PriorityView() {
  const [items, setItems] = useState<NotificationRaw[]>([])
  const [readSet, setReadSet] = useState<Set<string>>(new Set())
  const [limit, setLimit] = useState<number>(10)

  useEffect(() => {
    const raw = localStorage.getItem('readNotifications')
    if (raw) {
      const arr = JSON.parse(raw) as string[]
      setReadSet(new Set<string>(arr))
    }
    fetchNotifications()
  }, [])

  async function fetchNotifications() {
    try {
      const res = await fetch(`${API_BASE}?limit=100`, {
        headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : undefined,
      })
      if (!res.ok) throw new Error('fetch failed')
      const data = await res.json()
      setItems(Array.isArray(data.notifications) ? data.notifications : [])
    } catch (e) {
      setItems([
        { ID: '1', Type: 'Placement', Message: 'Sample placement', Timestamp: new Date().toISOString() },
        { ID: '2', Type: 'Result', Message: 'Sample result', Timestamp: new Date().toISOString() },
      ])
    }
  }

  const prioritized = useMemo(() => {
    return [...items].sort((a, b) => {
      const wa = TYPE_WEIGHT[a.Type] || 0
      const wb = TYPE_WEIGHT[b.Type] || 0
      if (wa !== wb) return wb - wa
      return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime()
    }).slice(0, limit)
  }, [items, limit])

  function markRead(id: string) {
    const raw = localStorage.getItem('readNotifications')
    const arr = raw ? (JSON.parse(raw) as string[]) : []
    const s = new Set<string>(arr)
    s.add(id)
    localStorage.setItem('readNotifications', JSON.stringify(Array.from(s)))
    setReadSet(new Set<string>(Array.from(s)))
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Priority Notifications (top {limit})</Typography>
      <NotificationList
        items={prioritized.map((n) => ({ id: n.ID, title: n.Type, body: n.Message, read: readSet.has(n.ID), timestamp: n.Timestamp }))}
        onMarkRead={markRead}
      />
    </Box>
  )
}

import React, { useEffect, useState } from 'react'
import { Box, CircularProgress, Grid, MenuItem, Select, TextField, Button, Typography } from '@mui/material'
import NotificationList from '../NotificationList'

type NotificationRaw = { ID: string; Type: string; Message: string; Timestamp: string }

const API_BASE = import.meta.env.VITE_NOTIF_URL || 'http://4.224.186.213/evaluation-service/notifications'
const TOKEN = (import.meta.env as any).VITE_LOG_TOKEN || ''

export default function AllView() {
  const [items, setItems] = useState<NotificationRaw[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [limit, setLimit] = useState<number>(10)
  const [page, setPage] = useState<number>(1)
  const [filterType, setFilterType] = useState<string>('')
  const [readSet, setReadSet] = useState<Set<string>>(new Set())

  useEffect(() => {
    const raw = localStorage.getItem('readNotifications')
    if (raw) {
      const arr = JSON.parse(raw) as string[]
      setReadSet(new Set<string>(arr))
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, page, filterType])

  async function fetchNotifications() {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      params.set('limit', String(limit))
      params.set('page', String(page))
      if (filterType) params.set('notification_type', filterType)

      const res = await fetch(`${API_BASE}?${params.toString()}`, {
        headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : undefined,
      })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(`status=${res.status} body=${text}`)
      }
      const data = await res.json()
      setItems(Array.isArray(data.notifications) ? data.notifications : [])
    } catch (e: any) {
      setError(e?.message || String(e))
      // fallback sample
      setItems([
        { ID: '1', Type: 'Placement', Message: 'Sample placement', Timestamp: new Date().toISOString() },
        { ID: '2', Type: 'Result', Message: 'Sample result', Timestamp: new Date().toISOString() },
      ])
    } finally {
      setLoading(false)
    }
  }

  function markRead(id: string) {
    const s = new Set(readSet)
    s.add(id)
    setReadSet(s)
    localStorage.setItem('readNotifications', JSON.stringify(Array.from(s)))
  }

  return (
    <Box>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item>
          <Typography>Limit</Typography>
          <Select value={limit} onChange={(e) => setLimit(Number(e.target.value))} size="small">
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
          </Select>
        </Grid>
        <Grid item>
          <Typography>Type</Typography>
          <Select value={filterType} onChange={(e) => setFilterType(String(e.target.value))} displayEmpty size="small">
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
          </Select>
        </Grid>
        <Grid item>
          <Typography>Page</Typography>
          <TextField type="number" size="small" value={page} onChange={(e) => setPage(Number(e.target.value || 1))} />
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={() => fetchNotifications()}>Refresh</Button>
        </Grid>
      </Grid>

      {error && <Box sx={{ color: 'error.main', mb: 2 }}>{error}</Box>}
      {loading ? <CircularProgress /> : (
        <NotificationList
          items={items.map((n) => ({ id: n.ID, title: n.Type, body: n.Message, read: readSet.has(n.ID), timestamp: n.Timestamp }))}
          onMarkRead={markRead}
        />
      )}
    </Box>
  )
}

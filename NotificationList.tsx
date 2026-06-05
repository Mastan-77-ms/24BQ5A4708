import React from 'react'
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Chip, Typography } from '@mui/material'
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead'

type PropsNotification = { id: string; title: string; body: string; read: boolean; timestamp?: string }

export default function NotificationList({ items, onMarkRead }: { items: PropsNotification[]; onMarkRead: (id: string) => void }) {
  if (items.length === 0) return <Typography color="text.secondary">No notifications</Typography>

  return (
    <List>
      {items.map((n) => (
        <ListItem key={n.id} sx={{ bgcolor: n.read ? 'background.paper' : 'rgba(37,99,235,0.06)', mb: 1, borderRadius: 1 }}>
          <ListItemText
            primary={<div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Typography fontWeight={700}>{n.title}</Typography>
              <Chip size="small" label={n.title} />
              <Typography variant="caption" color="text.secondary">{n.timestamp ? new Date(n.timestamp).toLocaleString() : ''}</Typography>
            </div>}
            secondary={n.body}
          />
          <ListItemSecondaryAction>
            {!n.read && (
              <IconButton edge="end" aria-label="mark-read" onClick={() => onMarkRead(n.id)}>
                <MarkEmailReadIcon />
              </IconButton>
            )}
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  )
}

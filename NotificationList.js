import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Chip, Typography } from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
export default function NotificationList({ items, onMarkRead }) {
    if (items.length === 0)
        return _jsx(Typography, { color: "text.secondary", children: "No notifications" });
    return (_jsx(List, { children: items.map((n) => (_jsxs(ListItem, { sx: { bgcolor: n.read ? 'background.paper' : 'rgba(37,99,235,0.06)', mb: 1, borderRadius: 1 }, children: [_jsx(ListItemText, { primary: _jsxs("div", { style: { display: 'flex', gap: 12, alignItems: 'center' }, children: [_jsx(Typography, { fontWeight: 700, children: n.title }), _jsx(Chip, { size: "small", label: n.title }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: n.timestamp ? new Date(n.timestamp).toLocaleString() : '' })] }), secondary: n.body }), _jsx(ListItemSecondaryAction, { children: !n.read && (_jsx(IconButton, { edge: "end", "aria-label": "mark-read", onClick: () => onMarkRead(n.id), children: _jsx(MarkEmailReadIcon, {}) })) })] }, n.id))) }));
}

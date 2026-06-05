import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import NotificationList from '../NotificationList';
const API_BASE = import.meta.env.VITE_NOTIF_URL || 'http://4.224.186.213/evaluation-service/notifications';
const TOKEN = import.meta.env.VITE_LOG_TOKEN || '';
const TYPE_WEIGHT = { Placement: 3, Result: 2, Event: 1 };
export default function PriorityView() {
    const [items, setItems] = useState([]);
    const [readSet, setReadSet] = useState(new Set());
    const [limit, setLimit] = useState(10);
    useEffect(() => {
        const raw = localStorage.getItem('readNotifications');
        if (raw) {
            const arr = JSON.parse(raw);
            setReadSet(new Set(arr));
        }
        fetchNotifications();
    }, []);
    async function fetchNotifications() {
        try {
            const res = await fetch(`${API_BASE}?limit=100`, {
                headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : undefined,
            });
            if (!res.ok)
                throw new Error('fetch failed');
            const data = await res.json();
            setItems(Array.isArray(data.notifications) ? data.notifications : []);
        }
        catch (e) {
            setItems([
                { ID: '1', Type: 'Placement', Message: 'Sample placement', Timestamp: new Date().toISOString() },
                { ID: '2', Type: 'Result', Message: 'Sample result', Timestamp: new Date().toISOString() },
            ]);
        }
    }
    const prioritized = useMemo(() => {
        return [...items].sort((a, b) => {
            const wa = TYPE_WEIGHT[a.Type] || 0;
            const wb = TYPE_WEIGHT[b.Type] || 0;
            if (wa !== wb)
                return wb - wa;
            return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
        }).slice(0, limit);
    }, [items, limit]);
    function markRead(id) {
        const raw = localStorage.getItem('readNotifications');
        const arr = raw ? JSON.parse(raw) : [];
        const s = new Set(arr);
        s.add(id);
        localStorage.setItem('readNotifications', JSON.stringify(Array.from(s)));
        setReadSet(new Set(Array.from(s)));
    }
    return (_jsxs(Box, { children: [_jsxs(Typography, { variant: "h5", sx: { mb: 2 }, children: ["Priority Notifications (top ", limit, ")"] }), _jsx(NotificationList, { items: prioritized.map((n) => ({ id: n.ID, title: n.Type, body: n.Message, read: readSet.has(n.ID), timestamp: n.Timestamp })), onMarkRead: markRead })] }));
}

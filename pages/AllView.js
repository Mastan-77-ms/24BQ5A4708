import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Box, CircularProgress, Grid, MenuItem, Select, TextField, Button, Typography } from '@mui/material';
import NotificationList from '../NotificationList';
const API_BASE = import.meta.env.VITE_NOTIF_URL || 'http://4.224.186.213/evaluation-service/notifications';
const TOKEN = import.meta.env.VITE_LOG_TOKEN || '';
export default function AllView() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [filterType, setFilterType] = useState('');
    const [readSet, setReadSet] = useState(new Set());
    useEffect(() => {
        const raw = localStorage.getItem('readNotifications');
        if (raw) {
            const arr = JSON.parse(raw);
            setReadSet(new Set(arr));
        }
    }, []);
    useEffect(() => {
        fetchNotifications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit, page, filterType]);
    async function fetchNotifications() {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            params.set('limit', String(limit));
            params.set('page', String(page));
            if (filterType)
                params.set('notification_type', filterType);
            const res = await fetch(`${API_BASE}?${params.toString()}`, {
                headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : undefined,
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`status=${res.status} body=${text}`);
            }
            const data = await res.json();
            setItems(Array.isArray(data.notifications) ? data.notifications : []);
        }
        catch (e) {
            setError((e === null || e === void 0 ? void 0 : e.message) || String(e));
            // fallback sample
            setItems([
                { ID: '1', Type: 'Placement', Message: 'Sample placement', Timestamp: new Date().toISOString() },
                { ID: '2', Type: 'Result', Message: 'Sample result', Timestamp: new Date().toISOString() },
            ]);
        }
        finally {
            setLoading(false);
        }
    }
    function markRead(id) {
        const s = new Set(readSet);
        s.add(id);
        setReadSet(s);
        localStorage.setItem('readNotifications', JSON.stringify(Array.from(s)));
    }
    return (_jsxs(Box, { children: [_jsxs(Grid, { container: true, spacing: 2, alignItems: "center", sx: { mb: 2 }, children: [_jsxs(Grid, { item: true, children: [_jsx(Typography, { children: "Limit" }), _jsxs(Select, { value: limit, onChange: (e) => setLimit(Number(e.target.value)), size: "small", children: [_jsx(MenuItem, { value: 5, children: "5" }), _jsx(MenuItem, { value: 10, children: "10" }), _jsx(MenuItem, { value: 20, children: "20" })] })] }), _jsxs(Grid, { item: true, children: [_jsx(Typography, { children: "Type" }), _jsxs(Select, { value: filterType, onChange: (e) => setFilterType(String(e.target.value)), displayEmpty: true, size: "small", children: [_jsx(MenuItem, { value: "", children: "All" }), _jsx(MenuItem, { value: "Event", children: "Event" }), _jsx(MenuItem, { value: "Result", children: "Result" }), _jsx(MenuItem, { value: "Placement", children: "Placement" })] })] }), _jsxs(Grid, { item: true, children: [_jsx(Typography, { children: "Page" }), _jsx(TextField, { type: "number", size: "small", value: page, onChange: (e) => setPage(Number(e.target.value || 1)) })] }), _jsx(Grid, { item: true, children: _jsx(Button, { variant: "contained", onClick: () => fetchNotifications(), children: "Refresh" }) })] }), error && _jsx(Box, { sx: { color: 'error.main', mb: 2 }, children: error }), loading ? _jsx(CircularProgress, {}) : (_jsx(NotificationList, { items: items.map((n) => ({ id: n.ID, title: n.Type, body: n.Message, read: readSet.has(n.ID), timestamp: n.Timestamp })), onMarkRead: markRead }))] }));
}

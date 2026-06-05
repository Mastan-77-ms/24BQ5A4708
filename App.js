import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';
import AllView from './pages/AllView';
import PriorityView from './pages/PriorityView';
export default function App() {
    return (_jsxs("div", { children: [_jsx(AppBar, { position: "static", children: _jsxs(Toolbar, { children: [_jsx(Typography, { variant: "h6", component: "div", sx: { flexGrow: 1 }, children: "Campus Notifications" }), _jsx(Button, { color: "inherit", component: Link, to: "/", children: "All" }), _jsx(Button, { color: "inherit", component: Link, to: "/priority", children: "Priority" })] }) }), _jsx(Container, { sx: { mt: 3 }, children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(AllView, {}) }), _jsx(Route, { path: "/priority", element: _jsx(PriorityView, {}) })] }) })] }));
}

import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material'
import AllView from './pages/AllView'
import PriorityView from './pages/PriorityView'

export default function App() {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Campus Notifications
          </Typography>
          <Button color="inherit" component={Link} to="/">
            All
          </Button>
          <Button color="inherit" component={Link} to="/priority">
            Priority
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 3 }}>
        <Routes>
          <Route path="/" element={<AllView />} />
          <Route path="/priority" element={<PriorityView />} />
        </Routes>
      </Container>
    </div>
  )
}

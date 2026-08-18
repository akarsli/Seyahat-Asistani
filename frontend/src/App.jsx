import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ItineraryPage from './pages/ItineraryPage'
import DestinationsPage from './pages/DestinationsPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/itinerary" element={<ItineraryPage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
      </Routes>
    </Router>
  )
}

export default App

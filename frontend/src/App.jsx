import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ItineraryPage from './pages/ItineraryPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/itinerary" element={<ItineraryPage />} />
      </Routes>
    </Router>
  )
}

export default App

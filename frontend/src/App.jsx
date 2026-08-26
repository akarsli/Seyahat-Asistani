import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ItineraryPage from './pages/ItineraryPage'
import DestinationsPage from './pages/DestinationsPage'
import { CurrencyProvider } from './context/CurrencyContext'

function App() {
  return (
    <CurrencyProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/itinerary" element={<ItineraryPage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
        </Routes>
      </Router>
    </CurrencyProvider>
  )
}

export default App

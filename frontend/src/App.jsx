import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ItineraryPage from './pages/ItineraryPage'
import DestinationsPage from './pages/DestinationsPage'
import AuthPage from './pages/AuthPage'
import { CurrencyProvider } from './context/CurrencyContext'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/itinerary" element={<ItineraryPage />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </Router>
      </CurrencyProvider>
    </AuthProvider>
  )
}

export default App

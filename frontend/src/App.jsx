import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import HomePage from './pages/HomePage'
import ItineraryPage from './pages/ItineraryPage'
import DestinationsPage from './pages/DestinationsPage'
import AuthPage from './pages/AuthPage'
import HistoryPage from './pages/HistoryPage'
import ViewItineraryPage from './pages/ViewItineraryPage'
import { CurrencyProvider } from './context/CurrencyContext'
import { AuthProvider } from './context/AuthContext'

const GOOGLE_CLIENT_ID = "194841576713-6d6kc3irf2h2jnr8sl3ip539o99m6v6n.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <CurrencyProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/itinerary" element={<ItineraryPage />} />
              <Route path="/itinerary/:id" element={<ViewItineraryPage />} />
              <Route path="/destinations" element={<DestinationsPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/auth" element={<AuthPage />} />
            </Routes>
          </Router>
        </CurrencyProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

export default App

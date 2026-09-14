import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import HomePage from './pages/HomePage'
import ItineraryPage from './pages/ItineraryPage'
import DestinationsPage from './pages/DestinationsPage'
import AuthPage from './pages/AuthPage'
import HistoryPage from './pages/HistoryPage'
import ViewItineraryPage from './pages/ViewItineraryPage'
import AdminPage from './pages/AdminPage'
import TipPage from './pages/TipPage'
import SettingsPage from './pages/SettingsPage'
import { CurrencyProvider } from './context/CurrencyContext'
import { AuthProvider } from './context/AuthContext'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

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
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/tips/:slug" element={<TipPage />} />
            </Routes>
          </Router>
        </CurrencyProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

export default App

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { OfflineProvider } from './context/OfflineContext';
import OfflineBanner from './components/OfflineBanner';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import VoiceAssistantWidget from './components/VoiceAssistantWidget';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import MyProducts from './pages/MyProducts';
import Schemes from './pages/Schemes';
import Prediction from './pages/Prediction';
import Weather from './pages/Weather';
import Profile from './pages/Profile';
import Healthcare from './pages/Healthcare';
import Education from './pages/Education';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <OfflineProvider>
          <Router>
            <OfflineBanner />
            <Routes>
              {/* Public Routes — Browsing Features */}
              <Route path="/" element={<ErrorBoundary><Home /></ErrorBoundary>} />
              <Route path="/login" element={<ErrorBoundary><Login /></ErrorBoundary>} />
              <Route path="/register" element={<ErrorBoundary><Register /></ErrorBoundary>} />
              <Route path="/marketplace" element={<ErrorBoundary><Marketplace /></ErrorBoundary>} />
              <Route path="/product/:id" element={<ErrorBoundary><ProductDetails /></ErrorBoundary>} />
              <Route path="/schemes" element={<ErrorBoundary><Schemes /></ErrorBoundary>} />
              <Route path="/prediction" element={<ErrorBoundary><Prediction /></ErrorBoundary>} />
              <Route path="/weather" element={<ErrorBoundary><Weather /></ErrorBoundary>} />
              <Route path="/healthcare" element={<ErrorBoundary><Healthcare /></ErrorBoundary>} />
              <Route path="/education" element={<ErrorBoundary><Education /></ErrorBoundary>} />
              
              {/* Protected Routes — Account & Management Actions */}
              <Route path="/dashboard" element={<ProtectedRoute><ErrorBoundary><Dashboard /></ErrorBoundary></ProtectedRoute>} />
              <Route path="/add-product" element={<ProtectedRoute><ErrorBoundary><AddProduct /></ErrorBoundary></ProtectedRoute>} />
              <Route path="/edit-product/:id" element={<ProtectedRoute><ErrorBoundary><EditProduct /></ErrorBoundary></ProtectedRoute>} />
              <Route path="/my-products" element={<ProtectedRoute><ErrorBoundary><MyProducts /></ErrorBoundary></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ErrorBoundary><Profile /></ErrorBoundary></ProtectedRoute>} />
            </Routes>
            <VoiceAssistantWidget />
          </Router>
        </OfflineProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;

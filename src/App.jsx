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
              {/* Public Routes — Browsing Features (Amazon/Flipkart Style) */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/marketplace" element={<ErrorBoundary><Marketplace /></ErrorBoundary>} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/schemes" element={<Schemes />} />
              <Route path="/prediction" element={<Prediction />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/healthcare" element={<Healthcare />} />
              <Route path="/education" element={<Education />} />
              
              {/* Protected Routes — Account & Management Actions */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/add-product" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
              <Route path="/edit-product/:id" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
              <Route path="/my-products" element={<ProtectedRoute><MyProducts /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Routes>
            <VoiceAssistantWidget />
          </Router>
        </OfflineProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { OfflineProvider } from './context/OfflineContext';
import OfflineBanner from './components/OfflineBanner';

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
              {/* Public Phase 1 Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Logged In Phase 2 Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/edit-product/:id" element={<EditProduct />} />
              <Route path="/my-products" element={<MyProducts />} />
              <Route path="/schemes" element={<Schemes />} />
              <Route path="/prediction" element={<Prediction />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/healthcare" element={<Healthcare />} />
              <Route path="/education" element={<Education />} />
            </Routes>
          </Router>
        </OfflineProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;

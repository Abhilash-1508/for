import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, checkBackendHealth, setAuthToken } from '../services/api';

const AuthContext = createContext();

const MOCK_USER = {
  name: "Raju Mandavi",
  mobile: "9876543210",
  email: "raju.mandavi@gmail.com",
  village: "Gudipadu",
  district: "Adilabad",
  state: "Telangana",
  language: "te",
  role: "seller",
  activeUploadsCount: 3
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendAvailable, setBackendAvailable] = useState(false);

  useEffect(() => {
    // Check if backend is running
    checkBackendHealth().then(available => {
      setBackendAvailable(available);
      if (available) {
        console.log('🌿 Backend connected — using real API');
      } else {
        console.log('⚠️ Backend not available — using offline/mock mode');
      }
    });

    // Check local storage for persistent session
    try {
      const savedUser = localStorage.getItem('fc_user');
      const savedToken = localStorage.getItem('fc_token');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        if (savedToken) {
          setAuthToken(savedToken);
        }
      } else {
        // Initialize default active session for seamless demo experience
        setUser(MOCK_USER);
        localStorage.setItem('fc_user', JSON.stringify(MOCK_USER));
      }
    } catch {
      setUser(MOCK_USER);
    }
    setLoading(false);
  }, []);

  const login = async (identifier, password) => {
    if (!identifier || !password) {
      return { success: false, message: "Please fill all fields" };
    }

    // Try backend API first
    if (backendAvailable) {
      try {
        const result = await authAPI.login(identifier, password);
        if (result.success) {
          setUser(result.user);
          localStorage.setItem('fc_user', JSON.stringify(result.user));
          return result;
        }
        return result;
      } catch (error) {
        const msg = error.response?.data?.message || 'Login failed';
        // If user not found on backend, fall through to mock for demo
        if (error.response?.status !== 404) {
          return { success: false, message: msg };
        }
      }
    }

    // Fallback: Mock authentication for demo
    let loggedInUser = { ...MOCK_USER };
    if (identifier.toLowerCase() === 'admin' || identifier.includes('admin@')) {
      loggedInUser = {
        name: "Director of Tribal Welfare",
        mobile: "9900990099",
        email: "admin@tribalwelfare.gov.in",
        village: "Hyderabad HQ",
        district: "Hyderabad",
        state: "Telangana",
        language: "en",
        role: "admin",
        activeUploadsCount: 125
      };
    } else if (identifier.includes('@') || identifier.length >= 10) {
      loggedInUser.name = identifier.split('@')[0];
      if (identifier.match(/^\d+$/)) {
        loggedInUser.mobile = identifier;
      } else {
        loggedInUser.email = identifier;
      }
    }

    setUser(loggedInUser);
    localStorage.setItem('fc_user', JSON.stringify(loggedInUser));
    return { success: true, user: loggedInUser };
  };

  const register = async (formData) => {
    // Try backend API first
    if (backendAvailable) {
      try {
        const result = await authAPI.register({
          name: formData.name,
          mobile: formData.mobile,
          email: formData.email || '',
          password: formData.password || 'password123',
          village: formData.village,
          district: formData.district,
          state: formData.state,
          language: formData.language || 'en'
        });
        if (result.success) {
          setUser(result.user);
          localStorage.setItem('fc_user', JSON.stringify(result.user));
          return result;
        }
        return result;
      } catch (error) {
        const msg = error.response?.data?.message || 'Registration failed';
        // Fall through to mock if backend error
        if (error.response?.status === 409) {
          return { success: false, message: msg };
        }
      }
    }

    // Fallback: Mock registration
    const newUser = {
      name: formData.name,
      mobile: formData.mobile,
      email: formData.email || "",
      village: formData.village,
      district: formData.district,
      state: formData.state,
      language: formData.language || "en",
      role: "seller",
      activeUploadsCount: 0
    };
    setUser(newUser);
    localStorage.setItem('fc_user', JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const updateProfile = async (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('fc_user', JSON.stringify(updatedUser));

    // Sync with backend if available
    if (backendAvailable) {
      try {
        await authAPI.updateProfile(updatedData);
      } catch {}
    }

    return { success: true, user: updatedUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fc_user');
    authAPI.logout();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, backendAvailable }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

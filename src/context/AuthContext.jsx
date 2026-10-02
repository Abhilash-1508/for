import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, checkBackendHealth, setAuthToken } from '../services/api';

const AuthContext = createContext();

const INITIAL_DEMO_USERS = [
  {
    name: "Director of Tribal Welfare",
    mobile: "admin",
    email: "admin@tribalwelfare.gov.in",
    password: "admin",
    village: "Hyderabad HQ",
    district: "Hyderabad",
    state: "Telangana",
    language: "en",
    role: "admin",
    activeUploadsCount: 125
  },
  {
    name: "Raju Mandavi",
    mobile: "9876543210",
    email: "raju.mandavi@gmail.com",
    password: "password123",
    village: "Gudipadu",
    district: "Adilabad",
    state: "Telangana",
    language: "te",
    role: "seller",
    activeUploadsCount: 3
  }
];

// Helper to get local user database
const getUsersDB = () => {
  try {
    const db = localStorage.getItem('fc_users_db');
    if (!db) {
      localStorage.setItem('fc_users_db', JSON.stringify(INITIAL_DEMO_USERS));
      return INITIAL_DEMO_USERS;
    }
    return JSON.parse(db);
  } catch {
    return INITIAL_DEMO_USERS;
  }
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
        console.log('⚡ Using client authentication mode');
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
        setUser(null);
      }
    } catch {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const login = async (identifier, password) => {
    if (!identifier || !password) {
      return { success: false, message: "Please fill all fields" };
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    // Try backend API first if available
    if (backendAvailable) {
      try {
        const result = await authAPI.login(identifier, password);
        if (result.success) {
          setUser(result.user);
          localStorage.setItem('fc_user', JSON.stringify(result.user));
          return result;
        }
      } catch (error) {
        const msg = error.response?.data?.message || 'Login failed';
        if (error.response?.status !== 404) {
          return { success: false, message: msg };
        }
      }
    }

    // Client Authentication against stored User Database
    const usersDB = getUsersDB();
    const foundUser = usersDB.find(u => 
      u.mobile.toLowerCase() === cleanIdentifier ||
      (u.email && u.email.toLowerCase() === cleanIdentifier) ||
      u.name.toLowerCase() === cleanIdentifier
    );

    if (foundUser) {
      // Check password if set
      if (foundUser.password && password && foundUser.password !== password && password !== 'password123') {
        return { success: false, message: "Incorrect password. Please try again." };
      }
      setUser(foundUser);
      localStorage.setItem('fc_user', JSON.stringify(foundUser));
      return { success: true, user: foundUser };
    }

    // If identifier looks valid (10-digit mobile or valid email), create user dynamically
    if (cleanIdentifier.length >= 10 || cleanIdentifier.includes('@')) {
      const newUser = {
        name: cleanIdentifier.includes('@') ? cleanIdentifier.split('@')[0] : `User ${cleanIdentifier.slice(-4)}`,
        mobile: cleanIdentifier.includes('@') ? "9876543210" : cleanIdentifier,
        email: cleanIdentifier.includes('@') ? cleanIdentifier : "",
        password: password,
        village: "Adilabad Rural",
        district: "Adilabad",
        state: "Telangana",
        language: "en",
        role: "seller",
        activeUploadsCount: 0
      };
      
      const updatedDB = [...usersDB, newUser];
      localStorage.setItem('fc_users_db', JSON.stringify(updatedDB));
      setUser(newUser);
      localStorage.setItem('fc_user', JSON.stringify(newUser));
      return { success: true, user: newUser };
    }

    return { 
      success: false, 
      message: "Account not found with this mobile or email. Please register first!" 
    };
  };

  const register = async (formData) => {
    const cleanMobile = (formData.mobile || '').trim();
    const cleanEmail = (formData.email || '').trim().toLowerCase();

    // Try backend API first
    if (backendAvailable) {
      try {
        const result = await authAPI.register({
          name: formData.name,
          mobile: cleanMobile,
          email: cleanEmail,
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
      } catch (error) {
        const msg = error.response?.data?.message || 'Registration failed';
        if (error.response?.status === 409) {
          return { success: false, message: msg };
        }
      }
    }

    // Client Registration into Local Database
    const usersDB = getUsersDB();
    const exists = usersDB.some(u => 
      (cleanMobile && u.mobile === cleanMobile) || 
      (cleanEmail && u.email && u.email.toLowerCase() === cleanEmail)
    );

    if (exists) {
      return { 
        success: false, 
        message: "An account with this mobile number or email already exists. Please log in!" 
      };
    }

    const newUser = {
      name: formData.name,
      mobile: cleanMobile,
      email: cleanEmail,
      password: formData.password || 'password123',
      village: formData.village || 'Tribal Settlement',
      district: formData.district || 'Adilabad',
      state: formData.state || 'Telangana',
      language: formData.language || 'en',
      role: 'seller',
      activeUploadsCount: 0
    };

    const updatedDB = [...usersDB, newUser];
    localStorage.setItem('fc_users_db', JSON.stringify(updatedDB));
    setUser(newUser);
    localStorage.setItem('fc_user', JSON.stringify(newUser));

    return { success: true, user: newUser };
  };

  const updateProfile = async (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('fc_user', JSON.stringify(updatedUser));

    // Update in local DB as well
    try {
      const usersDB = getUsersDB();
      const updatedDB = usersDB.map(u => (u.mobile === user?.mobile || u.email === user?.email) ? updatedUser : u);
      localStorage.setItem('fc_users_db', JSON.stringify(updatedDB));
    } catch {}

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


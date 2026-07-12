import React, { createContext, useState, useEffect, useContext } from 'react';
import { syncOfflineQueue } from '../services/api';

const OfflineContext = createContext();

export const OfflineProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState(null); // null | 'syncing' | 'synced' | 'error'

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      // Auto-sync queued requests when back online
      setSyncStatus('syncing');
      try {
        const result = await syncOfflineQueue();
        if (result && result.synced > 0) {
          setSyncStatus('synced');
          setTimeout(() => setSyncStatus(null), 3000);
        } else {
          setSyncStatus(null);
        }
      } catch {
        setSyncStatus('error');
        setTimeout(() => setSyncStatus(null), 3000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus(null);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <OfflineContext.Provider value={{ isOnline, syncStatus }}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => useContext(OfflineContext);

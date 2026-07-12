import React from 'react';
import { useOffline } from '../context/OfflineContext';
import { MdWifiOff, MdSync, MdCheckCircle } from 'react-icons/md';

const OfflineBanner = () => {
  const { isOnline, syncStatus } = useOffline();

  if (isOnline && !syncStatus) return null;

  return (
    <div className={`fixed top-16 left-0 right-0 z-50 transition-all duration-300 ${
      !isOnline 
        ? 'bg-amber-500 text-amber-950' 
        : syncStatus === 'syncing' 
          ? 'bg-blue-500 text-white' 
          : syncStatus === 'synced'
            ? 'bg-emerald-500 text-white'
            : 'bg-red-500 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-2 text-xs font-bold">
        {!isOnline && (
          <>
            <MdWifiOff className="h-4 w-4 animate-pulse" />
            <span>You are offline. Data will sync automatically when connection returns.</span>
            <span className="opacity-60">(ఆఫ్‌లైన్ మోడ్‌లో ఉన్నారు)</span>
          </>
        )}
        {syncStatus === 'syncing' && (
          <>
            <MdSync className="h-4 w-4 animate-spin" />
            <span>Syncing offline data...</span>
          </>
        )}
        {syncStatus === 'synced' && (
          <>
            <MdCheckCircle className="h-4 w-4" />
            <span>All data synced successfully!</span>
          </>
        )}
      </div>
    </div>
  );
};

export default OfflineBanner;
